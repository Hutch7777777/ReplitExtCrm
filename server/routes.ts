import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { 
  insertLeadSchema,
  insertCustomerSchema,
  insertEstimateSchema,
  insertJobSchema,
  insertCommunicationSchema,
  insertVendorSchema,
  insertWhiteLabelSettingsSchema 
} from "@shared/schema";
import { sendEmail, getEmails, getCalendarEvents, createCalendarEvent } from "./outlookClient";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

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
  app.get('/api/dashboard/stats', async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch dashboard stats' });
    }
  });

  // Leads routes
  app.get('/api/leads', async (req, res) => {
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

  app.get('/api/leads/:id', async (req, res) => {
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

  app.post('/api/leads', async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(leadData);
      broadcastUpdate('lead_created', lead);
      res.json(lead);
    } catch (error) {
      res.status(400).json({ message: 'Invalid lead data' });
    }
  });

  app.patch('/api/leads/:id', async (req, res) => {
    try {
      const leadData = insertLeadSchema.partial().parse(req.body);
      const lead = await storage.updateLead(req.params.id, leadData);
      broadcastUpdate('lead_updated', lead);
      res.json(lead);
    } catch (error) {
      res.status(400).json({ message: 'Failed to update lead' });
    }
  });

  app.delete('/api/leads/:id', async (req, res) => {
    try {
      await storage.deleteLead(req.params.id);
      broadcastUpdate('lead_deleted', { id: req.params.id });
      res.json({ message: 'Lead deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete lead' });
    }
  });

  // Customers routes
  app.get('/api/customers', async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch customers' });
    }
  });

  app.post('/api/customers', async (req, res) => {
    try {
      const customerData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(customerData);
      res.json(customer);
    } catch (error) {
      res.status(400).json({ message: 'Invalid customer data' });
    }
  });

  // Estimates routes
  app.get('/api/estimates', async (req, res) => {
    try {
      const estimates = await storage.getEstimates();
      res.json(estimates);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch estimates' });
    }
  });

  app.post('/api/estimates', async (req, res) => {
    try {
      const estimateData = insertEstimateSchema.parse(req.body);
      const estimate = await storage.createEstimate(estimateData);
      broadcastUpdate('estimate_created', estimate);
      res.json(estimate);
    } catch (error) {
      res.status(400).json({ message: 'Invalid estimate data' });
    }
  });

  app.patch('/api/estimates/:id', async (req, res) => {
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
  app.get('/api/jobs', async (req, res) => {
    try {
      const jobs = await storage.getJobs();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch jobs' });
    }
  });

  app.post('/api/jobs', async (req, res) => {
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
  app.get('/api/communications', async (req, res) => {
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

  app.post('/api/communications', async (req, res) => {
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
  app.get('/api/vendors', async (req, res) => {
    try {
      const vendors = await storage.getVendors();
      res.json(vendors);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch vendors' });
    }
  });

  app.post('/api/vendors', async (req, res) => {
    try {
      const vendorData = insertVendorSchema.parse(req.body);
      const vendor = await storage.createVendor(vendorData);
      res.json(vendor);
    } catch (error) {
      res.status(400).json({ message: 'Invalid vendor data' });
    }
  });

  // White label settings routes
  app.get('/api/white-label', async (req, res) => {
    try {
      const settings = await storage.getWhiteLabelSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch white label settings' });
    }
  });

  app.patch('/api/white-label', async (req, res) => {
    try {
      const settingsData = insertWhiteLabelSettingsSchema.parse(req.body);
      const settings = await storage.updateWhiteLabelSettings(settingsData);
      broadcastUpdate('white_label_updated', settings);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ message: 'Invalid white label settings' });
    }
  });

  // Outlook integration routes
  app.post('/api/outlook/send-email', async (req, res) => {
    try {
      const { to, subject, content, cc } = req.body;
      await sendEmail(to, subject, content, cc);
      res.json({ message: 'Email sent successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to send email' });
    }
  });

  app.get('/api/outlook/emails', async (req, res) => {
    try {
      const { folder = 'inbox', top = 25 } = req.query;
      const emails = await getEmails(folder as string, Number(top));
      res.json(emails);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch emails' });
    }
  });

  app.get('/api/outlook/calendar', async (req, res) => {
    try {
      const { startTime, endTime } = req.query;
      const events = await getCalendarEvents(startTime as string, endTime as string);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch calendar events' });
    }
  });

  app.post('/api/outlook/calendar', async (req, res) => {
    try {
      const { subject, start, end, attendees, location } = req.body;
      const event = await createCalendarEvent(subject, start, end, attendees, location);
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create calendar event' });
    }
  });

  return httpServer;
}
