import { 
  type User, type InsertUser,
  type Customer, type InsertCustomer,
  type Lead, type InsertLead,
  type Estimate, type InsertEstimate,
  type Job, type InsertJob,
  type Communication, type InsertCommunication,
  type Vendor, type InsertVendor,
  type WhiteLabelSettings, type InsertWhiteLabelSettings
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
  
  // White Label Settings
  getWhiteLabelSettings(): Promise<WhiteLabelSettings>;
  updateWhiteLabelSettings(settings: InsertWhiteLabelSettings): Promise<WhiteLabelSettings>;
  
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
  private customers: Map<string, Customer> = new Map();
  private leads: Map<string, Lead> = new Map();
  private estimates: Map<string, Estimate> = new Map();
  private jobs: Map<string, Job> = new Map();
  private communications: Map<string, Communication> = new Map();
  private vendors: Map<string, Vendor> = new Map();
  private whiteLabelSettings: WhiteLabelSettings | undefined;

  constructor() {
    // Initialize with default white label settings
    this.whiteLabelSettings = {
      id: randomUUID(),
      companyName: "Exterior Finishes",
      logo: "",
      primaryColor: "hsl(38.23, 87.6%, 74.71%)",
      secondaryColor: "hsl(39.27, 43.31%, 24.9%)",
      accentColor: "hsl(74.4, 39.68%, 87.65%)",
      domain: "",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
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
    };
    this.users.set(id, user);
    return user;
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

export const storage = new MemStorage();
