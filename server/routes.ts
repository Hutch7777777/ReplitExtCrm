import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import { randomUUID } from "crypto";
import { 
  insertLeadSchema,
  insertCustomerSchema,
  insertEstimateSchema,
  insertJobSchema,
  insertCommunicationSchema,
  insertVendorSchema,
  insertFileAttachmentSchema,
  insertWhiteLabelSettingsSchema,
  insertUserSettingsSchema,
  insertTeamMemberSchema
} from "@shared/schema";
import { z } from "zod";

// Safe account update schema - only allow specific fields
const accountUpdateSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),  
  email: z.string().email(),
  role: z.string().min(1).max(100), // Consider restricting to enum in production
}).partial();
import { sendEmail, getEmails, getCalendarEvents, createCalendarEvent } from "./outlookClient";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { setupLocalAuth } from "./localAuth";
import { registerUserSchema, loginUserSchema, type RegisterUser } from "@shared/schema";
import passport from "passport";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Setup authentication
  await setupAuth(app);
  setupLocalAuth();

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    clients.add(ws);
    
    ws.on('close', () => {
      clients.delete(ws);
    });
  });

  function broadcastUpdate(type: string, data: any) {
    const message = JSON.stringify({ type, data });
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Dashboard stats
  app.get('/api/dashboard/stats', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch dashboard stats' });
    }
  });

  // Leads routes
  app.get('/api/leads', isAuthenticated, async (req, res) => {
    try {
      const { division } = req.query;
      const leads = division 
        ? await storage.getLeadsByDivision(division as string)
        : await storage.getLeads();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch leads' });
    }
  });

  app.get('/api/leads/:id', isAuthenticated, async (req, res) => {
    try {
      const lead = await storage.getLead(req.params.id);
      if (!lead) {
        return res.status(404).json({ message: 'Lead not found' });
      }
      res.json(lead);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch lead' });
    }
  });

  app.post('/api/leads', isAuthenticated, async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(leadData);
      broadcastUpdate('lead_created', lead);
      res.json(lead);
    } catch (error) {
      res.status(400).json({ message: 'Invalid lead data' });
    }
  });

  app.patch('/api/leads/:id', isAuthenticated, async (req, res) => {
    try {
      const leadData = insertLeadSchema.partial().parse(req.body);
      const lead = await storage.updateLead(req.params.id, leadData);
      broadcastUpdate('lead_updated', lead);
      res.json(lead);
    } catch (error) {
      res.status(400).json({ message: 'Failed to update lead' });
    }
  });

  app.delete('/api/leads/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteLead(req.params.id);
      broadcastUpdate('lead_deleted', { id: req.params.id });
      res.json({ message: 'Lead deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete lead' });
    }
  });

  // Customers routes
  app.get('/api/customers', isAuthenticated, async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch customers' });
    }
  });

  app.post('/api/customers', isAuthenticated, async (req, res) => {
    try {
      const customerData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(customerData);
      res.json(customer);
    } catch (error) {
      res.status(400).json({ message: 'Invalid customer data' });
    }
  });

  // Estimates routes
  app.get('/api/estimates', isAuthenticated, async (req, res) => {
    try {
      const estimates = await storage.getEstimates();
      res.json(estimates);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch estimates' });
    }
  });

  app.post('/api/estimates', isAuthenticated, async (req, res) => {
    try {
      const estimateData = insertEstimateSchema.parse(req.body);
      const estimate = await storage.createEstimate(estimateData);
      broadcastUpdate('estimate_created', estimate);
      res.json(estimate);
    } catch (error) {
      res.status(400).json({ message: 'Invalid estimate data' });
    }
  });

  app.patch('/api/estimates/:id', isAuthenticated, async (req, res) => {
    try {
      const estimateData = insertEstimateSchema.partial().parse(req.body);
      const estimate = await storage.updateEstimate(req.params.id, estimateData);
      broadcastUpdate('estimate_updated', estimate);
      res.json(estimate);
    } catch (error) {
      res.status(400).json({ message: 'Failed to update estimate' });
    }
  });

  // Jobs routes
  app.get('/api/jobs', isAuthenticated, async (req, res) => {
    try {
      const jobs = await storage.getJobs();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch jobs' });
    }
  });

  app.post('/api/jobs', isAuthenticated, async (req, res) => {
    try {
      const jobData = insertJobSchema.parse(req.body);
      const job = await storage.createJob(jobData);
      broadcastUpdate('job_created', job);
      res.json(job);
    } catch (error) {
      res.status(400).json({ message: 'Invalid job data' });
    }
  });

  // Communications routes
  app.get('/api/communications', isAuthenticated, async (req, res) => {
    try {
      const { leadId, customerId } = req.query;
      let communications;
      
      if (leadId) {
        communications = await storage.getCommunicationsByLead(leadId as string);
      } else if (customerId) {
        communications = await storage.getCommunicationsByCustomer(customerId as string);
      } else {
        communications = await storage.getCommunications();
      }
      
      res.json(communications);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch communications' });
    }
  });

  app.post('/api/communications', isAuthenticated, async (req, res) => {
    try {
      const commData = insertCommunicationSchema.parse(req.body);
      const communication = await storage.createCommunication(commData);
      broadcastUpdate('communication_created', communication);
      res.json(communication);
    } catch (error) {
      res.status(400).json({ message: 'Invalid communication data' });
    }
  });

  // Vendors routes
  app.get('/api/vendors', isAuthenticated, async (req, res) => {
    try {
      const vendors = await storage.getVendors();
      res.json(vendors);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch vendors' });
    }
  });

  app.post('/api/vendors', isAuthenticated, async (req, res) => {
    try {
      const vendorData = insertVendorSchema.parse(req.body);
      const vendor = await storage.createVendor(vendorData);
      res.json(vendor);
    } catch (error) {
      res.status(400).json({ message: 'Invalid vendor data' });
    }
  });

  // Team members routes
  app.get('/api/team-members', isAuthenticated, async (req, res) => {
    try {
      const { division, position } = req.query;
      let teamMembers;
      
      if (division) {
        teamMembers = await storage.getTeamMembersByDivision(division as string);
      } else if (position) {
        teamMembers = await storage.getTeamMembersByPosition(position as string);
      } else {
        teamMembers = await storage.getTeamMembers();
      }
      
      res.json(teamMembers);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch team members' });
    }
  });

  app.get('/api/team-members/:id', isAuthenticated, async (req, res) => {
    try {
      const teamMember = await storage.getTeamMember(req.params.id);
      if (!teamMember) {
        return res.status(404).json({ message: 'Team member not found' });
      }
      res.json(teamMember);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch team member' });
    }
  });

  app.post('/api/team-members', isAuthenticated, async (req, res) => {
    try {
      const teamMemberData = insertTeamMemberSchema.parse(req.body);
      const teamMember = await storage.createTeamMember(teamMemberData);
      broadcastUpdate('team_member_created', teamMember);
      res.json(teamMember);
    } catch (error) {
      res.status(400).json({ message: 'Invalid team member data' });
    }
  });

  app.patch('/api/team-members/:id', isAuthenticated, async (req, res) => {
    try {
      const teamMemberData = insertTeamMemberSchema.partial().parse(req.body);
      const teamMember = await storage.updateTeamMember(req.params.id, teamMemberData);
      broadcastUpdate('team_member_updated', teamMember);
      res.json(teamMember);
    } catch (error) {
      res.status(400).json({ message: 'Failed to update team member' });
    }
  });

  app.delete('/api/team-members/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteTeamMember(req.params.id);
      broadcastUpdate('team_member_deleted', { id: req.params.id });
      res.json({ message: 'Team member deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete team member' });
    }
  });

  // White label settings routes
  app.get('/api/white-label', isAuthenticated, async (req, res) => {
    try {
      const settings = await storage.getWhiteLabelSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch white label settings' });
    }
  });

  app.patch('/api/white-label', isAuthenticated, async (req, res) => {
    try {
      const settingsData = insertWhiteLabelSettingsSchema.parse(req.body);
      const settings = await storage.updateWhiteLabelSettings(settingsData);
      broadcastUpdate('white_label_updated', settings);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ message: 'Invalid white label settings' });
    }
  });

  // File upload configuration
  const uploadsDir = path.join(process.cwd(), 'uploads');
  
  // Ensure uploads directory exists
  const ensureUploadsDir = async () => {
    try {
      await fs.access(uploadsDir);
    } catch {
      await fs.mkdir(uploadsDir, { recursive: true });
    }
  };
  
  // Sanitize and validate entity IDs to prevent directory traversal
  const sanitizeEntityId = (id: string): string => {
    if (!id || typeof id !== 'string') return '';
    // Only allow alphanumeric, hyphens, and underscores (UUID-safe pattern)
    return id.replace(/[^a-zA-Z0-9_-]/g, '');
  };

  const validateEntityId = (id: string): boolean => {
    return /^[a-zA-Z0-9_-]+$/.test(id) && id.length > 0 && id.length <= 100;
  };

  // Configure multer for file uploads
  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const { leadId, estimateId, jobId } = req.body;
        let subDir = 'general';
        
        // Sanitize and validate entity IDs to prevent directory traversal
        if (leadId) {
          const sanitizedId = sanitizeEntityId(leadId);
          if (!validateEntityId(sanitizedId)) {
            return cb(new Error('Invalid leadId format'), '');
          }
          subDir = `leads/${sanitizedId}`;
        } else if (estimateId) {
          const sanitizedId = sanitizeEntityId(estimateId);
          if (!validateEntityId(sanitizedId)) {
            return cb(new Error('Invalid estimateId format'), '');
          }
          subDir = `estimates/${sanitizedId}`;
        } else if (jobId) {
          const sanitizedId = sanitizeEntityId(jobId);
          if (!validateEntityId(sanitizedId)) {
            return cb(new Error('Invalid jobId format'), '');
          }
          subDir = `jobs/${sanitizedId}`;
        }
        
        const fullPath = path.join(uploadsDir, subDir);
        
        // Ensure the resolved path is still within uploads directory
        const resolvedPath = path.resolve(fullPath);
        const resolvedUploadsDir = path.resolve(uploadsDir);
        if (!resolvedPath.startsWith(resolvedUploadsDir)) {
          return cb(new Error('Invalid path: directory traversal detected'), '');
        }
        
        // Use synchronous mkdir or callback-based mkdir
        fs.mkdir(fullPath, { recursive: true })
          .then(() => cb(null, fullPath))
          .catch((error) => cb(error, ''));
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${randomUUID()}`;
        const extension = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, extension);
        const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9-_]/g, '_');
        cb(null, `${sanitizedBaseName}-${uniqueSuffix}${extension}`);
      }
    }),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
      // Allow common business file types
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'text/csv',
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/zip'
      ];
      
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`File type ${file.mimetype} not allowed`));
      }
    }
  });

  // Initialize uploads directory
  await ensureUploadsDir();

  // File Attachment routes
  app.post('/api/attachments/upload', isAuthenticated, (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        // Handle multer errors with appropriate status codes
        if (err.message?.includes('File type') || err.message?.includes('not allowed')) {
          return res.status(415).json({ message: err.message }); // Unsupported Media Type
        } else if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({ message: 'File too large' }); // Payload Too Large
        } else if (err.message?.includes('Invalid') && err.message?.includes('format')) {
          return res.status(400).json({ message: err.message }); // Bad Request
        } else {
          return res.status(500).json({ message: 'Upload failed' });
        }
      }
      next();
    });
  }, async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const { leadId, estimateId, jobId, uploadedBy } = req.body;
      
      if (!leadId && !estimateId && !jobId) {
        return res.status(400).json({ message: 'Must specify leadId, estimateId, or jobId' });
      }

      const attachmentData = {
        leadId: leadId || null,
        estimateId: estimateId || null,
        jobId: jobId || null,
        originalName: req.file.originalname,
        fileName: req.file.filename,
        filePath: req.file.path,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        uploadedBy: uploadedBy || null,
      };

      const parsedData = insertFileAttachmentSchema.parse(attachmentData);
      const attachment = await storage.createFileAttachment(parsedData);
      
      broadcastUpdate('attachment_created', attachment);
      res.json(attachment);
    } catch (error: any) {
      // Clean up uploaded file if database save fails
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch {}
      }
      
      if (error.message?.includes('File type')) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: 'Failed to upload file' });
    }
  });

  app.get('/api/attachments/:id/download', isAuthenticated, async (req, res) => {
    try {
      const attachment = await storage.getFileAttachment(req.params.id);
      if (!attachment) {
        return res.status(404).json({ message: 'Attachment not found' });
      }

      // Check if file exists
      try {
        await fs.access(attachment.filePath);
      } catch {
        return res.status(404).json({ message: 'File not found on disk' });
      }

      // Sanitize filename for Content-Disposition header
      const sanitizeFilename = (filename: string): string => {
        // Remove control characters and problematic characters
        return filename.replace(/[\x00-\x1f\x80-\x9f"\\]/g, '').replace(/[<>:"/|?*]/g, '_');
      };
      
      const safeFilename = sanitizeFilename(attachment.originalName);
      const encodedFilename = encodeURIComponent(safeFilename);
      
      res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"; filename*=UTF-8''${encodedFilename}`);
      res.setHeader('Content-Type', attachment.mimeType);
      res.sendFile(path.resolve(attachment.filePath));
    } catch (error) {
      res.status(500).json({ message: 'Failed to download file' });
    }
  });

  // Thumbnail endpoint for image attachments
  app.get('/api/attachments/:id/thumbnail', isAuthenticated, async (req, res) => {
    try {
      const attachment = await storage.getFileAttachment(req.params.id);
      if (!attachment) {
        return res.status(404).json({ message: 'Attachment not found' });
      }

      // Check if file is an image
      if (!attachment.mimeType.startsWith('image/')) {
        return res.status(400).json({ message: 'File is not an image' });
      }

      // Get thumbnail size with proper validation
      const requested = Number.parseInt(String(req.query.size), 10);
      const defaultSize = 100;
      const maxSize = 300;
      const minSize = 16;
      
      if (req.query.size && (!isFinite(requested) || requested < minSize)) {
        return res.status(422).json({ message: 'Invalid size parameter. Must be a number >= 16' });
      }
      
      const thumbnailSize = Math.max(minSize, Math.min(isFinite(requested) ? requested : defaultSize, maxSize));

      try {
        // Check if file exists
        await fs.access(attachment.filePath);

        // Generate thumbnail using Sharp
        const thumbnailBuffer = await sharp(attachment.filePath)
          .resize(thumbnailSize, thumbnailSize, {
            fit: 'cover',
            position: 'center'
          })
          .jpeg({ quality: 85 }) // Convert to JPEG for consistent output
          .toBuffer();

        // Set cache headers
        res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Length', thumbnailBuffer.length);
        
        res.send(thumbnailBuffer);
      } catch (fileError) {
        console.warn(`Failed to generate thumbnail for ${attachment.filePath}:`, fileError);
        res.status(404).json({ message: 'File not found or cannot be processed' });
      }
    } catch (error) {
      console.error('Thumbnail generation error:', error);
      res.status(500).json({ message: 'Failed to generate thumbnail' });
    }
  });

  app.get('/api/leads/:id/attachments', isAuthenticated, async (req, res) => {
    try {
      const attachments = await storage.getFileAttachmentsByLead(req.params.id);
      res.json(attachments);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch attachments' });
    }
  });

  app.get('/api/estimates/:id/attachments', isAuthenticated, async (req, res) => {
    try {
      const attachments = await storage.getFileAttachmentsByEstimate(req.params.id);
      res.json(attachments);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch attachments' });
    }
  });

  app.get('/api/jobs/:id/attachments', isAuthenticated, async (req, res) => {
    try {
      const attachments = await storage.getFileAttachmentsByJob(req.params.id);
      res.json(attachments);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch attachments' });
    }
  });

  app.delete('/api/attachments/:id', isAuthenticated, async (req, res) => {
    try {
      const attachment = await storage.getFileAttachment(req.params.id);
      if (!attachment) {
        return res.status(404).json({ message: 'Attachment not found' });
      }

      // Delete file from disk
      try {
        await fs.unlink(attachment.filePath);
      } catch (error) {
        console.warn(`Failed to delete file from disk: ${attachment.filePath}`, error);
      }

      // Delete from database
      await storage.deleteFileAttachment(req.params.id);
      
      broadcastUpdate('attachment_deleted', { id: req.params.id });
      res.json({ message: 'Attachment deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete attachment' });
    }
  });

  // Outlook integration routes
  app.post('/api/outlook/send-email', isAuthenticated, async (req, res) => {
    try {
      const { to, subject, content, cc } = req.body;
      await sendEmail(to, subject, content, cc);
      res.json({ message: 'Email sent successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to send email' });
    }
  });

  app.get('/api/outlook/emails', isAuthenticated, async (req, res) => {
    try {
      const { folder = 'inbox', top = 25 } = req.query;
      const emails = await getEmails(folder as string, Number(top));
      res.json(emails);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch emails' });
    }
  });

  app.get('/api/outlook/calendar', isAuthenticated, async (req, res) => {
    try {
      const { startTime, endTime } = req.query;
      const events = await getCalendarEvents(startTime as string, endTime as string);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch calendar events' });
    }
  });

  app.post('/api/outlook/calendar', isAuthenticated, async (req, res) => {
    try {
      const { subject, start, end, attendees, location } = req.body;
      const event = await createCalendarEvent(subject, start, end, attendees, location);
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create calendar event' });
    }
  });

  // Settings routes
  app.get('/api/settings/account/:userId', isAuthenticated, async (req, res) => {
    try {
      // Basic access control - only allow known test user for now  
      if (req.params.userId !== 'user_1') {
        return res.status(403).json({ message: 'Access denied' });
      }

      const user = await storage.getUser(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Return only safe user fields - never include password
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      };
      res.json(safeUser);
    } catch (error) {
      console.error('Account fetch error:', error);
      res.status(500).json({ message: 'Failed to fetch user account' });
    }
  });

  app.put('/api/settings/account/:userId', isAuthenticated, async (req, res) => {
    try {
      // Basic access control - only allow known test user for now
      if (req.params.userId !== 'user_1') {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Validate and whitelist input fields
      const validatedData = accountUpdateSchema.parse(req.body);
      
      const updatedUser = await storage.updateUser(req.params.userId, validatedData);
      
      // Return and broadcast only safe user fields
      const safeUser = {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role
      };
      
      broadcastUpdate('user_updated', safeUser);
      res.json(safeUser);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: 'Invalid input data' });
      }
      console.error('Account update error:', error);
      res.status(500).json({ message: 'Failed to update user account' });
    }
  });

  app.get('/api/settings/preferences/:userId', isAuthenticated, async (req, res) => {
    try {
      // Basic access control - only allow known test user for now
      if (req.params.userId !== 'user_1') {
        return res.status(403).json({ message: 'Access denied' });
      }

      let settings = await storage.getUserSettings(req.params.userId);
      if (!settings) {
        // Create and return default settings if none exist
        settings = await storage.createUserSettings({ userId: req.params.userId });
      }
      res.json(settings);
    } catch (error) {
      console.error('Preferences fetch error:', error);
      res.status(500).json({ message: 'Failed to fetch user settings' });
    }
  });

  app.put('/api/settings/preferences/:userId', isAuthenticated, async (req, res) => {
    try {
      // Basic access control - only allow known test user for now
      if (req.params.userId !== 'user_1') {
        return res.status(403).json({ message: 'Access denied' });
      }

      const validatedSettings = insertUserSettingsSchema.parse({
        userId: req.params.userId,
        ...req.body
      });
      const updatedSettings = await storage.updateUserSettings(req.params.userId, validatedSettings);
      broadcastUpdate('user_settings_updated', updatedSettings);
      res.json(updatedSettings);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: 'Invalid settings data' });
      }
      console.error('Settings update error:', error);
      res.status(500).json({ message: 'Failed to update user settings' });
    }
  });

  // Local Authentication routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = registerUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      
      // Create user (password will be hashed automatically)
      const user = await storage.createUser(userData);
      
      // Auto-login after registration
      req.login(user, (err) => {
        if (err) {
          console.error('Auto-login error:', err);
          return res.status(500).json({ message: 'Registration successful but auto-login failed' });
        }
        
        // Return user without password
        const { password, ...safeUser } = user;
        res.status(201).json(safeUser);
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: 'Invalid user data', errors: error.errors });
      }
      res.status(500).json({ message: 'Registration failed' });
    }
  });
  
  app.post('/api/auth/login', passport.authenticate('local'), (req: any, res) => {
    // If we reach here, authentication was successful
    const { password, ...safeUser } = req.user;
    res.json(safeUser);
  });
  
  // Get current user (works for both OAuth and local auth)
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      let userId;
      if (req.user.claims) {
        // OAuth user (Replit auth)
        userId = req.user.claims.sub;
      } else {
        // Local auth user
        userId = req.user.id;
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Return user without password
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  return httpServer;
}
