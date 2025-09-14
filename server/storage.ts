import { 
  type User, type InsertUser, type UpsertUser,
  type Customer, type InsertCustomer,
  type Lead, type InsertLead,
  type Estimate, type InsertEstimate,
  type Job, type InsertJob,
  type Communication, type InsertCommunication,
  type Vendor, type InsertVendor,
  type FileAttachment, type InsertFileAttachment,
  type WhiteLabelSettings, type InsertWhiteLabelSettings,
  type UserSettings, type InsertUserSettings,
  type TeamMember, type InsertTeamMember,
  users, customers, leads, estimates, jobs, communications, vendors,
  fileAttachments, whiteLabelSettings, userSettings, teamMembers
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>; // Required for Replit Auth
  
  // User Settings
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  createUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
  updateUserSettings(userId: string, settings: Partial<InsertUserSettings>): Promise<UserSettings>;
  
  // Customers
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer>;
  
  // Leads
  getLeads(): Promise<Lead[]>;
  getLeadsByDivision(division: string): Promise<Lead[]>;
  getLead(id: string): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: string, lead: Partial<InsertLead>): Promise<Lead>;
  deleteLead(id: string): Promise<void>;
  
  // Estimates
  getEstimates(): Promise<Estimate[]>;
  getEstimate(id: string): Promise<Estimate | undefined>;
  getEstimatesByCustomer(customerId: string): Promise<Estimate[]>;
  createEstimate(estimate: InsertEstimate): Promise<Estimate>;
  updateEstimate(id: string, estimate: Partial<InsertEstimate>): Promise<Estimate>;
  
  // Jobs
  getJobs(): Promise<Job[]>;
  getJob(id: string): Promise<Job | undefined>;
  getJobsByCustomer(customerId: string): Promise<Job[]>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: string, job: Partial<InsertJob>): Promise<Job>;
  
  // Communications
  getCommunications(): Promise<Communication[]>;
  getCommunication(id: string): Promise<Communication | undefined>;
  getCommunicationsByLead(leadId: string): Promise<Communication[]>;
  getCommunicationsByCustomer(customerId: string): Promise<Communication[]>;
  createCommunication(communication: InsertCommunication): Promise<Communication>;
  updateCommunication(id: string, communication: Partial<InsertCommunication>): Promise<Communication>;
  
  // Vendors
  getVendors(): Promise<Vendor[]>;
  getVendor(id: string): Promise<Vendor | undefined>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  updateVendor(id: string, vendor: Partial<InsertVendor>): Promise<Vendor>;
  
  // File Attachments
  getFileAttachments(): Promise<FileAttachment[]>;
  getFileAttachment(id: string): Promise<FileAttachment | undefined>;
  getFileAttachmentsByLead(leadId: string): Promise<FileAttachment[]>;
  getFileAttachmentsByEstimate(estimateId: string): Promise<FileAttachment[]>;
  getFileAttachmentsByJob(jobId: string): Promise<FileAttachment[]>;
  createFileAttachment(attachment: InsertFileAttachment): Promise<FileAttachment>;
  updateFileAttachment(id: string, attachment: Partial<InsertFileAttachment>): Promise<FileAttachment>;
  deleteFileAttachment(id: string): Promise<void>;
  deleteFileAttachmentsByLead(leadId: string): Promise<void>;
  deleteFileAttachmentsByEstimate(estimateId: string): Promise<void>;
  deleteFileAttachmentsByJob(jobId: string): Promise<void>;
  
  // White Label Settings
  getWhiteLabelSettings(): Promise<WhiteLabelSettings>;
  updateWhiteLabelSettings(settings: InsertWhiteLabelSettings): Promise<WhiteLabelSettings>;
  
  // Team Members
  getTeamMembers(): Promise<TeamMember[]>;
  getTeamMember(id: string): Promise<TeamMember | undefined>;
  getTeamMembersByDivision(division: string): Promise<TeamMember[]>;
  getTeamMembersByPosition(position: string): Promise<TeamMember[]>;
  getTeamMemberByUserId(userId: string): Promise<TeamMember | undefined>;
  createTeamMember(teamMember: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: string, teamMember: Partial<InsertTeamMember>): Promise<TeamMember>;
  deleteTeamMember(id: string): Promise<void>;
  
  // Dashboard Stats
  getDashboardStats(): Promise<{
    totalLeads: number;
    activeEstimates: number;
    conversionRate: number;
    closedDeals: number;
    leadGrowth: number;
    estimateGrowth: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private userSettings: Map<string, UserSettings> = new Map();
  private customers: Map<string, Customer> = new Map();
  private leads: Map<string, Lead> = new Map();
  private estimates: Map<string, Estimate> = new Map();
  private jobs: Map<string, Job> = new Map();
  private communications: Map<string, Communication> = new Map();
  private vendors: Map<string, Vendor> = new Map();
  private fileAttachments: Map<string, FileAttachment> = new Map();
  private teamMembers: Map<string, TeamMember> = new Map();
  private whiteLabelSettings: WhiteLabelSettings | undefined;

  constructor() {
    // Initialize with Exterior Finishes white label settings
    this.whiteLabelSettings = {
      id: randomUUID(),
      companyName: "Exterior Finishes",
      logo: "/src/assets/exterior-finishes-logo.png",
      primaryColor: "hsl(210, 60%, 45%)",
      secondaryColor: "hsl(210, 30%, 25%)",
      accentColor: "hsl(210, 40%, 88%)",
      domain: "",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Initialize with test user
    const testUser: User = {
      id: "user_1",
      username: "john.smith",
      password: "password123",
      email: "john.smith@company.com", 
      firstName: "John",
      lastName: "Smith",
      profileImageUrl: null,
      role: "Sales Manager",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set("user_1", testUser);
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      role: insertUser.role || "user",
      isActive: insertUser.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id);
    if (existingUser) {
      // Update existing user
      const updatedUser: User = {
        ...existingUser,
        ...userData,
        firstName: userData.firstName ?? existingUser.firstName,
        lastName: userData.lastName ?? existingUser.lastName,
        email: userData.email ?? existingUser.email,
        updatedAt: new Date(),
      };
      this.users.set(userData.id, updatedUser);
      return updatedUser;
    } else {
      // Create new user
      const newUser: User = {
        ...userData,
        firstName: userData.firstName ?? null,
        lastName: userData.lastName ?? null,
        email: userData.email ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.set(userData.id, newUser);
      return newUser;
    }
  }

  async updateUser(id: string, updateUser: Partial<InsertUser>): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser: User = { ...user, ...updateUser };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // User Settings
  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    return Array.from(this.userSettings.values()).find(
      (settings) => settings.userId === userId,
    );
  }

  async createUserSettings(insertSettings: InsertUserSettings): Promise<UserSettings> {
    const id = randomUUID();
    const settings: UserSettings = {
      userId: insertSettings.userId,
      theme: insertSettings.theme || "system",
      language: insertSettings.language || "en", 
      timezone: insertSettings.timezone || "America/New_York",
      emailNotifications: insertSettings.emailNotifications ?? true,
      emailDigestFrequency: insertSettings.emailDigestFrequency || "daily",
      newLeadEmail: insertSettings.newLeadEmail ?? true,
      leadAssignmentEmail: insertSettings.leadAssignmentEmail ?? true,
      estimateReminderEmail: insertSettings.estimateReminderEmail ?? true,
      deadlineAlertEmail: insertSettings.deadlineAlertEmail ?? true,
      weeklyReportEmail: insertSettings.weeklyReportEmail ?? false,
      newLeadInApp: insertSettings.newLeadInApp ?? true,
      leadAssignmentInApp: insertSettings.leadAssignmentInApp ?? true,
      estimateReminderInApp: insertSettings.estimateReminderInApp ?? true,
      deadlineAlertInApp: insertSettings.deadlineAlertInApp ?? true,
      urgentLeadSMS: insertSettings.urgentLeadSMS ?? false,
      deadlineAlertSMS: insertSettings.deadlineAlertSMS ?? false,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.userSettings.set(id, settings);
    return settings;
  }

  async updateUserSettings(userId: string, updateSettings: Partial<InsertUserSettings>): Promise<UserSettings> {
    const settings = await this.getUserSettings(userId);
    if (!settings) {
      // Create default settings if they don't exist
      return this.createUserSettings({ userId, ...updateSettings });
    }
    const updatedSettings: UserSettings = {
      ...settings,
      ...updateSettings,
      updatedAt: new Date(),
    };
    this.userSettings.set(settings.id, updatedSettings);
    return updatedSettings;
  }

  // Customers
  async getCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = randomUUID();
    const customer: Customer = {
      ...insertCustomer,
      id,
      email: insertCustomer.email || null,
      phone: insertCustomer.phone || null,
      address: insertCustomer.address || null,
      city: insertCustomer.city || null,
      state: insertCustomer.state || null,
      zipCode: insertCustomer.zipCode || null,
      notes: insertCustomer.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.customers.set(id, customer);
    return customer;
  }

  async updateCustomer(id: string, customerUpdate: Partial<InsertCustomer>): Promise<Customer> {
    const existing = this.customers.get(id);
    if (!existing) throw new Error("Customer not found");
    
    const customer: Customer = {
      ...existing,
      ...customerUpdate,
      updatedAt: new Date(),
    };
    this.customers.set(id, customer);
    return customer;
  }

  // Leads
  async getLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }

  async getLeadsByDivision(division: string): Promise<Lead[]> {
    return Array.from(this.leads.values()).filter(lead => lead.division === division);
  }

  async getLead(id: string): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = randomUUID();
    const lead: Lead = {
      ...insertLead,
      id,
      customerId: insertLead.customerId || null,
      email: insertLead.email || null,
      phone: insertLead.phone || null,
      estimatedValue: insertLead.estimatedValue || null,
      assignedTo: insertLead.assignedTo || null,
      notes: insertLead.notes || null,
      source: insertLead.source || null,
      attachments: insertLead.attachments || [],
      status: insertLead.status ?? "new",
      priority: insertLead.priority ?? "medium",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.leads.set(id, lead);
    return lead;
  }

  async updateLead(id: string, leadUpdate: Partial<InsertLead>): Promise<Lead> {
    const existing = this.leads.get(id);
    if (!existing) throw new Error("Lead not found");
    
    const lead: Lead = {
      ...existing,
      ...leadUpdate,
      updatedAt: new Date(),
    };
    this.leads.set(id, lead);
    return lead;
  }

  async deleteLead(id: string): Promise<void> {
    // Clean up associated file attachments first
    await this.deleteFileAttachmentsByLead(id);
    this.leads.delete(id);
  }

  // Estimates
  async getEstimates(): Promise<Estimate[]> {
    return Array.from(this.estimates.values());
  }

  async getEstimate(id: string): Promise<Estimate | undefined> {
    return this.estimates.get(id);
  }

  async getEstimatesByCustomer(customerId: string): Promise<Estimate[]> {
    return Array.from(this.estimates.values()).filter(estimate => estimate.customerId === customerId);
  }

  async createEstimate(insertEstimate: InsertEstimate): Promise<Estimate> {
    const id = randomUUID();
    const estimate: Estimate = {
      ...insertEstimate,
      id,
      leadId: insertEstimate.leadId || null,
      customerId: insertEstimate.customerId || null,
      description: insertEstimate.description || null,
      materialsCost: insertEstimate.materialsCost || null,
      laborCost: insertEstimate.laborCost || null,
      status: insertEstimate.status || "draft",
      validUntil: insertEstimate.validUntil || null,
      createdBy: insertEstimate.createdBy || null,
      approvedBy: insertEstimate.approvedBy || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.estimates.set(id, estimate);
    return estimate;
  }

  async updateEstimate(id: string, estimateUpdate: Partial<InsertEstimate>): Promise<Estimate> {
    const existing = this.estimates.get(id);
    if (!existing) throw new Error("Estimate not found");
    
    const estimate: Estimate = {
      ...existing,
      ...estimateUpdate,
      updatedAt: new Date(),
    };
    this.estimates.set(id, estimate);
    return estimate;
  }

  // Jobs
  async getJobs(): Promise<Job[]> {
    return Array.from(this.jobs.values());
  }

  async getJob(id: string): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async getJobsByCustomer(customerId: string): Promise<Job[]> {
    return Array.from(this.jobs.values()).filter(job => job.customerId === customerId);
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = randomUUID();
    const job: Job = {
      ...insertJob,
      id,
      estimateId: insertJob.estimateId || null,
      customerId: insertJob.customerId || null,
      description: insertJob.description || null,
      status: insertJob.status || "scheduled",
      scheduledStart: insertJob.scheduledStart || null,
      actualStart: insertJob.actualStart || null,
      scheduledEnd: insertJob.scheduledEnd || null,
      actualEnd: insertJob.actualEnd || null,
      assignedTo: insertJob.assignedTo || null,
      notes: insertJob.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.jobs.set(id, job);
    return job;
  }

  async updateJob(id: string, jobUpdate: Partial<InsertJob>): Promise<Job> {
    const existing = this.jobs.get(id);
    if (!existing) throw new Error("Job not found");
    
    const job: Job = {
      ...existing,
      ...jobUpdate,
      updatedAt: new Date(),
    };
    this.jobs.set(id, job);
    return job;
  }

  // Communications
  async getCommunications(): Promise<Communication[]> {
    return Array.from(this.communications.values());
  }

  async getCommunication(id: string): Promise<Communication | undefined> {
    return this.communications.get(id);
  }

  async getCommunicationsByLead(leadId: string): Promise<Communication[]> {
    return Array.from(this.communications.values()).filter(comm => comm.leadId === leadId);
  }

  async getCommunicationsByCustomer(customerId: string): Promise<Communication[]> {
    return Array.from(this.communications.values()).filter(comm => comm.customerId === customerId);
  }

  async createCommunication(insertCommunication: InsertCommunication): Promise<Communication> {
    const id = randomUUID();
    const communication: Communication = {
      ...insertCommunication,
      id,
      leadId: insertCommunication.leadId || null,
      customerId: insertCommunication.customerId || null,
      userId: insertCommunication.userId || null,
      subject: insertCommunication.subject || null,
      content: insertCommunication.content || null,
      emailMessageId: insertCommunication.emailMessageId || null,
      attachments: insertCommunication.attachments || null,
      scheduledFor: insertCommunication.scheduledFor || null,
      completedAt: insertCommunication.completedAt || null,
      createdAt: new Date(),
    };
    this.communications.set(id, communication);
    return communication;
  }

  async updateCommunication(id: string, commUpdate: Partial<InsertCommunication>): Promise<Communication> {
    const existing = this.communications.get(id);
    if (!existing) throw new Error("Communication not found");
    
    const communication: Communication = {
      ...existing,
      ...commUpdate,
    };
    this.communications.set(id, communication);
    return communication;
  }

  // Vendors
  async getVendors(): Promise<Vendor[]> {
    return Array.from(this.vendors.values());
  }

  async getVendor(id: string): Promise<Vendor | undefined> {
    return this.vendors.get(id);
  }

  async createVendor(insertVendor: InsertVendor): Promise<Vendor> {
    const id = randomUUID();
    const vendor: Vendor = {
      ...insertVendor,
      id,
      contactPerson: insertVendor.contactPerson || null,
      email: insertVendor.email || null,
      phone: insertVendor.phone || null,
      address: insertVendor.address || null,
      category: insertVendor.category || null,
      rating: insertVendor.rating || null,
      notes: insertVendor.notes || null,
      isActive: insertVendor.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.vendors.set(id, vendor);
    return vendor;
  }

  async updateVendor(id: string, vendorUpdate: Partial<InsertVendor>): Promise<Vendor> {
    const existing = this.vendors.get(id);
    if (!existing) throw new Error("Vendor not found");
    
    const vendor: Vendor = {
      ...existing,
      ...vendorUpdate,
      updatedAt: new Date(),
    };
    this.vendors.set(id, vendor);
    return vendor;
  }

  // File Attachments
  async getFileAttachments(): Promise<FileAttachment[]> {
    return Array.from(this.fileAttachments.values());
  }

  async getFileAttachment(id: string): Promise<FileAttachment | undefined> {
    return this.fileAttachments.get(id);
  }

  async getFileAttachmentsByLead(leadId: string): Promise<FileAttachment[]> {
    return Array.from(this.fileAttachments.values()).filter(
      attachment => attachment.leadId === leadId
    );
  }

  async getFileAttachmentsByEstimate(estimateId: string): Promise<FileAttachment[]> {
    return Array.from(this.fileAttachments.values()).filter(
      attachment => attachment.estimateId === estimateId
    );
  }

  async getFileAttachmentsByJob(jobId: string): Promise<FileAttachment[]> {
    return Array.from(this.fileAttachments.values()).filter(
      attachment => attachment.jobId === jobId
    );
  }

  async createFileAttachment(insertAttachment: InsertFileAttachment): Promise<FileAttachment> {
    const id = randomUUID();
    const attachment: FileAttachment = {
      ...insertAttachment,
      id,
      leadId: insertAttachment.leadId || null,
      estimateId: insertAttachment.estimateId || null,
      jobId: insertAttachment.jobId || null,
      uploadedBy: insertAttachment.uploadedBy || null,
      createdAt: new Date(),
    };
    this.fileAttachments.set(id, attachment);
    
    // Update lead's attachments array for consistency
    if (attachment.leadId) {
      const lead = this.leads.get(attachment.leadId);
      if (lead) {
        const updatedAttachments = [...(lead.attachments || []), id];
        const updatedLead = { ...lead, attachments: updatedAttachments, updatedAt: new Date() };
        this.leads.set(attachment.leadId, updatedLead);
      }
    }
    
    return attachment;
  }

  async updateFileAttachment(id: string, attachmentUpdate: Partial<InsertFileAttachment>): Promise<FileAttachment> {
    const existing = this.fileAttachments.get(id);
    if (!existing) throw new Error("File attachment not found");
    
    const prevLeadId = existing.leadId;
    const newLeadId = attachmentUpdate.leadId !== undefined ? attachmentUpdate.leadId : prevLeadId;
    
    const attachment: FileAttachment = {
      ...existing,
      ...attachmentUpdate,
      id: existing.id, // Preserve original ID
      createdAt: existing.createdAt, // Preserve creation date
      leadId: newLeadId,
    };
    this.fileAttachments.set(id, attachment);
    
    // Handle lead attachments array synchronization when leadId changes
    if (prevLeadId !== newLeadId) {
      // Remove from previous lead's attachments array
      if (prevLeadId) {
        const prevLead = this.leads.get(prevLeadId);
        if (prevLead && prevLead.attachments) {
          const updatedAttachments = prevLead.attachments.filter(attId => attId !== id);
          const updatedPrevLead = { ...prevLead, attachments: updatedAttachments, updatedAt: new Date() };
          this.leads.set(prevLeadId, updatedPrevLead);
        }
      }
      
      // Add to new lead's attachments array
      if (newLeadId) {
        const newLead = this.leads.get(newLeadId);
        if (newLead) {
          const currentAttachments = newLead.attachments || [];
          // Avoid duplicates
          if (!currentAttachments.includes(id)) {
            const updatedAttachments = [...currentAttachments, id];
            const updatedNewLead = { ...newLead, attachments: updatedAttachments, updatedAt: new Date() };
            this.leads.set(newLeadId, updatedNewLead);
          }
        }
      }
    }
    
    return attachment;
  }

  async deleteFileAttachment(id: string): Promise<void> {
    const attachment = this.fileAttachments.get(id);
    if (attachment) {
      // Remove from lead's attachments array for consistency
      if (attachment.leadId) {
        const lead = this.leads.get(attachment.leadId);
        if (lead && lead.attachments) {
          const updatedAttachments = lead.attachments.filter(attId => attId !== id);
          const updatedLead = { ...lead, attachments: updatedAttachments, updatedAt: new Date() };
          this.leads.set(attachment.leadId, updatedLead);
        }
      }
      this.fileAttachments.delete(id);
    }
  }

  async deleteFileAttachmentsByLead(leadId: string): Promise<void> {
    const attachments = Array.from(this.fileAttachments.values())
      .filter(attachment => attachment.leadId === leadId);
    
    for (const attachment of attachments) {
      this.fileAttachments.delete(attachment.id);
    }
    
    // Clear lead's attachments array
    const lead = this.leads.get(leadId);
    if (lead) {
      const updatedLead = { ...lead, attachments: [], updatedAt: new Date() };
      this.leads.set(leadId, updatedLead);
    }
  }

  async deleteFileAttachmentsByEstimate(estimateId: string): Promise<void> {
    const attachments = Array.from(this.fileAttachments.values())
      .filter(attachment => attachment.estimateId === estimateId);
    
    for (const attachment of attachments) {
      // Remove from associated lead's attachments array if it exists
      if (attachment.leadId) {
        const lead = this.leads.get(attachment.leadId);
        if (lead && lead.attachments) {
          const updatedAttachments = lead.attachments.filter(attId => attId !== attachment.id);
          const updatedLead = { ...lead, attachments: updatedAttachments, updatedAt: new Date() };
          this.leads.set(attachment.leadId, updatedLead);
        }
      }
      this.fileAttachments.delete(attachment.id);
    }
  }

  async deleteFileAttachmentsByJob(jobId: string): Promise<void> {
    const attachments = Array.from(this.fileAttachments.values())
      .filter(attachment => attachment.jobId === jobId);
    
    for (const attachment of attachments) {
      // Remove from associated lead's attachments array if it exists
      if (attachment.leadId) {
        const lead = this.leads.get(attachment.leadId);
        if (lead && lead.attachments) {
          const updatedAttachments = lead.attachments.filter(attId => attId !== attachment.id);
          const updatedLead = { ...lead, attachments: updatedAttachments, updatedAt: new Date() };
          this.leads.set(attachment.leadId, updatedLead);
        }
      }
      this.fileAttachments.delete(attachment.id);
    }
  }

  // White Label Settings
  async getWhiteLabelSettings(): Promise<WhiteLabelSettings> {
    return this.whiteLabelSettings!;
  }

  async updateWhiteLabelSettings(settings: InsertWhiteLabelSettings): Promise<WhiteLabelSettings> {
    const id = this.whiteLabelSettings?.id || randomUUID();
    this.whiteLabelSettings = {
      ...settings,
      id,
      logo: settings.logo || null,
      primaryColor: settings.primaryColor || null,
      secondaryColor: settings.secondaryColor || null,
      accentColor: settings.accentColor || null,
      domain: settings.domain || null,
      isActive: settings.isActive ?? true,
      createdAt: this.whiteLabelSettings?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    return this.whiteLabelSettings;
  }

  // Team Members
  async getTeamMembers(): Promise<TeamMember[]> {
    return Array.from(this.teamMembers.values());
  }

  async getTeamMember(id: string): Promise<TeamMember | undefined> {
    return this.teamMembers.get(id);
  }

  async getTeamMembersByDivision(division: string): Promise<TeamMember[]> {
    return Array.from(this.teamMembers.values()).filter(member => member.division === division && member.isActive);
  }

  async getTeamMembersByPosition(position: string): Promise<TeamMember[]> {
    return Array.from(this.teamMembers.values()).filter(member => member.position === position && member.isActive);
  }

  async getTeamMemberByUserId(userId: string): Promise<TeamMember | undefined> {
    return Array.from(this.teamMembers.values()).find(member => member.userId === userId);
  }

  async createTeamMember(insertTeamMember: InsertTeamMember): Promise<TeamMember> {
    const id = randomUUID();
    const teamMember: TeamMember = {
      ...insertTeamMember,
      id,
      hireDate: insertTeamMember.hireDate || null,
      phone: insertTeamMember.phone || null,
      notes: insertTeamMember.notes || null,
      isActive: insertTeamMember.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.teamMembers.set(id, teamMember);
    return teamMember;
  }

  async updateTeamMember(id: string, teamMemberUpdate: Partial<InsertTeamMember>): Promise<TeamMember> {
    const existing = this.teamMembers.get(id);
    if (!existing) throw new Error("Team member not found");
    
    const teamMember: TeamMember = {
      ...existing,
      ...teamMemberUpdate,
      updatedAt: new Date(),
    };
    this.teamMembers.set(id, teamMember);
    return teamMember;
  }

  async deleteTeamMember(id: string): Promise<void> {
    this.teamMembers.delete(id);
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<{
    totalLeads: number;
    activeEstimates: number;
    conversionRate: number;
    closedDeals: number;
    leadGrowth: number;
    estimateGrowth: number;
  }> {
    const totalLeads = this.leads.size;
    const activeEstimates = Array.from(this.estimates.values()).filter(e => e.status === 'pending').length;
    const wonLeads = Array.from(this.leads.values()).filter(l => l.status === 'won').length;
    const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
    
    // Calculate closed deals value
    const closedDeals = Array.from(this.estimates.values())
      .filter(e => e.status === 'approved')
      .reduce((sum, e) => sum + Number(e.totalCost || 0), 0);

    return {
      totalLeads,
      activeEstimates,
      conversionRate,
      closedDeals,
      leadGrowth: 12, // Mock growth percentage
      estimateGrowth: 8, // Mock growth percentage
    };
  }
}

// Temporarily using in-memory storage while debugging database connection
// import { DbStorage } from './dbStorage';
// export const storage = new DbStorage();

// DatabaseStorage implementation for production
export class DatabaseStorage implements IStorage {
  // User operations - required for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!username) return undefined;
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, updateUser: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(updateUser)
      .where(eq(users.id, id))
      .returning();
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        firstName: userData.firstName ?? null,
        lastName: userData.lastName ?? null,
        email: userData.email ?? null,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          firstName: userData.firstName ?? null,
          lastName: userData.lastName ?? null,
          email: userData.email ?? null,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Stub implementations for other methods (keeping MemStorage behavior temporarily)
  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    return memStorage.getUserSettings(userId);
  }

  async createUserSettings(settings: InsertUserSettings): Promise<UserSettings> {
    return memStorage.createUserSettings(settings);
  }

  async updateUserSettings(userId: string, settings: Partial<InsertUserSettings>): Promise<UserSettings> {
    return memStorage.updateUserSettings(userId, settings);
  }

  async getCustomers(): Promise<Customer[]> {
    return memStorage.getCustomers();
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    return memStorage.getCustomer(id);
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    return memStorage.createCustomer(customer);
  }

  async updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer> {
    return memStorage.updateCustomer(id, customer);
  }

  async getLeads(): Promise<Lead[]> {
    return memStorage.getLeads();
  }

  async getLeadsByDivision(division: string): Promise<Lead[]> {
    return memStorage.getLeadsByDivision(division);
  }

  async getLead(id: string): Promise<Lead | undefined> {
    return memStorage.getLead(id);
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    return memStorage.createLead(lead);
  }

  async updateLead(id: string, lead: Partial<InsertLead>): Promise<Lead> {
    return memStorage.updateLead(id, lead);
  }

  async deleteLead(id: string): Promise<void> {
    return memStorage.deleteLead(id);
  }

  async getEstimates(): Promise<Estimate[]> {
    return memStorage.getEstimates();
  }

  async getEstimate(id: string): Promise<Estimate | undefined> {
    return memStorage.getEstimate(id);
  }

  async getEstimatesByCustomer(customerId: string): Promise<Estimate[]> {
    return memStorage.getEstimatesByCustomer(customerId);
  }

  async createEstimate(estimate: InsertEstimate): Promise<Estimate> {
    return memStorage.createEstimate(estimate);
  }

  async updateEstimate(id: string, estimate: Partial<InsertEstimate>): Promise<Estimate> {
    return memStorage.updateEstimate(id, estimate);
  }

  async getJobs(): Promise<Job[]> {
    return memStorage.getJobs();
  }

  async getJob(id: string): Promise<Job | undefined> {
    return memStorage.getJob(id);
  }

  async getJobsByCustomer(customerId: string): Promise<Job[]> {
    return memStorage.getJobsByCustomer(customerId);
  }

  async createJob(job: InsertJob): Promise<Job> {
    return memStorage.createJob(job);
  }

  async updateJob(id: string, job: Partial<InsertJob>): Promise<Job> {
    return memStorage.updateJob(id, job);
  }

  async getCommunications(): Promise<Communication[]> {
    return memStorage.getCommunications();
  }

  async getCommunication(id: string): Promise<Communication | undefined> {
    return memStorage.getCommunication(id);
  }

  async getCommunicationsByLead(leadId: string): Promise<Communication[]> {
    return memStorage.getCommunicationsByLead(leadId);
  }

  async getCommunicationsByCustomer(customerId: string): Promise<Communication[]> {
    return memStorage.getCommunicationsByCustomer(customerId);
  }

  async createCommunication(communication: InsertCommunication): Promise<Communication> {
    return memStorage.createCommunication(communication);
  }

  async updateCommunication(id: string, communication: Partial<InsertCommunication>): Promise<Communication> {
    return memStorage.updateCommunication(id, communication);
  }

  async getVendors(): Promise<Vendor[]> {
    return memStorage.getVendors();
  }

  async getVendor(id: string): Promise<Vendor | undefined> {
    return memStorage.getVendor(id);
  }

  async createVendor(vendor: InsertVendor): Promise<Vendor> {
    return memStorage.createVendor(vendor);
  }

  async updateVendor(id: string, vendor: Partial<InsertVendor>): Promise<Vendor> {
    return memStorage.updateVendor(id, vendor);
  }

  async getFileAttachments(): Promise<FileAttachment[]> {
    return memStorage.getFileAttachments();
  }

  async getFileAttachment(id: string): Promise<FileAttachment | undefined> {
    return memStorage.getFileAttachment(id);
  }

  async getFileAttachmentsByLead(leadId: string): Promise<FileAttachment[]> {
    return memStorage.getFileAttachmentsByLead(leadId);
  }

  async getFileAttachmentsByEstimate(estimateId: string): Promise<FileAttachment[]> {
    return memStorage.getFileAttachmentsByEstimate(estimateId);
  }

  async getFileAttachmentsByJob(jobId: string): Promise<FileAttachment[]> {
    return memStorage.getFileAttachmentsByJob(jobId);
  }

  async createFileAttachment(attachment: InsertFileAttachment): Promise<FileAttachment> {
    return memStorage.createFileAttachment(attachment);
  }

  async deleteFileAttachment(id: string): Promise<void> {
    return memStorage.deleteFileAttachment(id);
  }

  async getWhiteLabelSettings(): Promise<WhiteLabelSettings | undefined> {
    return memStorage.getWhiteLabelSettings();
  }

  async updateWhiteLabelSettings(settings: Partial<InsertWhiteLabelSettings>): Promise<WhiteLabelSettings> {
    return memStorage.updateWhiteLabelSettings(settings);
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    return memStorage.getTeamMembers();
  }

  async getTeamMembersByDivision(division: string): Promise<TeamMember[]> {
    return memStorage.getTeamMembersByDivision(division);
  }

  async getTeamMembersByPosition(position: string): Promise<TeamMember[]> {
    return memStorage.getTeamMembersByPosition(position);
  }

  async getTeamMember(id: string): Promise<TeamMember | undefined> {
    return memStorage.getTeamMember(id);
  }

  async createTeamMember(teamMember: InsertTeamMember): Promise<TeamMember> {
    return memStorage.createTeamMember(teamMember);
  }

  async updateTeamMember(id: string, teamMember: Partial<InsertTeamMember>): Promise<TeamMember> {
    return memStorage.updateTeamMember(id, teamMember);
  }

  async deleteTeamMember(id: string): Promise<void> {
    return memStorage.deleteTeamMember(id);
  }

  async getDashboardStats(): Promise<any> {
    return memStorage.getDashboardStats();
  }
}

// Create instances
const memStorage = new MemStorage();
export const storage = new DatabaseStorage();
