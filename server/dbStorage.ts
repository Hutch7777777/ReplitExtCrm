import { eq, desc } from 'drizzle-orm';
import { db } from './db';
import { 
  users, customers, leads, estimates, jobs, communications, vendors, whiteLabelSettings,
  type User, type InsertUser,
  type Customer, type InsertCustomer,
  type Lead, type InsertLead,
  type Estimate, type InsertEstimate,
  type Job, type InsertJob,
  type Communication, type InsertCommunication,
  type Vendor, type InsertVendor,
  type WhiteLabelSettings, type InsertWhiteLabelSettings
} from "../shared/schema";
import type { IStorage } from "./storage";

export class DbStorage implements IStorage {
  
  // Users
  async getUsers(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.isActive, true));
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User> {
    const result = await db.update(users).set(user).where(eq(users.id, id)).returning();
    if (result.length === 0) throw new Error("User not found");
    return result[0];
  }

  // Customers
  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers).orderBy(desc(customers.createdAt));
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    const result = await db.select().from(customers).where(eq(customers.id, id)).limit(1);
    return result[0];
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const result = await db.insert(customers).values(customer).returning();
    return result[0];
  }

  async updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer> {
    const result = await db.update(customers).set(customer).where(eq(customers.id, id)).returning();
    if (result.length === 0) throw new Error("Customer not found");
    return result[0];
  }

  // Leads
  async getLeads(): Promise<Lead[]> {
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async getLeadsByDivision(division: string): Promise<Lead[]> {
    return await db.select().from(leads).where(eq(leads.division, division as any)).orderBy(desc(leads.createdAt));
  }

  async getLead(id: string): Promise<Lead | undefined> {
    const result = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
    return result[0];
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const result = await db.insert(leads).values(lead).returning();
    return result[0];
  }

  async updateLead(id: string, lead: Partial<InsertLead>): Promise<Lead> {
    const result = await db.update(leads).set(lead).where(eq(leads.id, id)).returning();
    if (result.length === 0) throw new Error("Lead not found");
    return result[0];
  }

  async deleteLead(id: string): Promise<void> {
    await db.delete(leads).where(eq(leads.id, id));
  }

  // Estimates
  async getEstimates(): Promise<Estimate[]> {
    return await db.select().from(estimates).orderBy(desc(estimates.createdAt));
  }

  async getEstimate(id: string): Promise<Estimate | undefined> {
    const result = await db.select().from(estimates).where(eq(estimates.id, id)).limit(1);
    return result[0];
  }

  async getEstimatesByCustomer(customerId: string): Promise<Estimate[]> {
    return await db.select().from(estimates).where(eq(estimates.customerId, customerId));
  }

  async createEstimate(estimate: InsertEstimate): Promise<Estimate> {
    const result = await db.insert(estimates).values(estimate).returning();
    return result[0];
  }

  async updateEstimate(id: string, estimate: Partial<InsertEstimate>): Promise<Estimate> {
    const result = await db.update(estimates).set(estimate).where(eq(estimates.id, id)).returning();
    if (result.length === 0) throw new Error("Estimate not found");
    return result[0];
  }

  // Jobs
  async getJobs(): Promise<Job[]> {
    return await db.select().from(jobs).orderBy(desc(jobs.createdAt));
  }

  async getJob(id: string): Promise<Job | undefined> {
    const result = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
    return result[0];
  }

  async getJobsByCustomer(customerId: string): Promise<Job[]> {
    return await db.select().from(jobs).where(eq(jobs.customerId, customerId));
  }

  async createJob(job: InsertJob): Promise<Job> {
    const result = await db.insert(jobs).values(job).returning();
    return result[0];
  }

  async updateJob(id: string, job: Partial<InsertJob>): Promise<Job> {
    const result = await db.update(jobs).set(job).where(eq(jobs.id, id)).returning();
    if (result.length === 0) throw new Error("Job not found");
    return result[0];
  }

  // Communications
  async getCommunications(): Promise<Communication[]> {
    return await db.select().from(communications).orderBy(desc(communications.createdAt));
  }

  async getCommunication(id: string): Promise<Communication | undefined> {
    const result = await db.select().from(communications).where(eq(communications.id, id)).limit(1);
    return result[0];
  }

  async getCommunicationsByLead(leadId: string): Promise<Communication[]> {
    return await db.select().from(communications).where(eq(communications.leadId, leadId));
  }

  async getCommunicationsByCustomer(customerId: string): Promise<Communication[]> {
    return await db.select().from(communications).where(eq(communications.customerId, customerId));
  }

  async createCommunication(communication: InsertCommunication): Promise<Communication> {
    const result = await db.insert(communications).values(communication).returning();
    return result[0];
  }

  async updateCommunication(id: string, communication: Partial<InsertCommunication>): Promise<Communication> {
    const result = await db.update(communications).set(communication).where(eq(communications.id, id)).returning();
    if (result.length === 0) throw new Error("Communication not found");
    return result[0];
  }

  // Vendors
  async getVendors(): Promise<Vendor[]> {
    return await db.select().from(vendors).orderBy(desc(vendors.createdAt));
  }

  async getVendor(id: string): Promise<Vendor | undefined> {
    const result = await db.select().from(vendors).where(eq(vendors.id, id)).limit(1);
    return result[0];
  }

  async createVendor(vendor: InsertVendor): Promise<Vendor> {
    const result = await db.insert(vendors).values(vendor).returning();
    return result[0];
  }

  async updateVendor(id: string, vendor: Partial<InsertVendor>): Promise<Vendor> {
    const result = await db.update(vendors).set(vendor).where(eq(vendors.id, id)).returning();
    if (result.length === 0) throw new Error("Vendor not found");
    return result[0];
  }

  // White Label Settings
  async getWhiteLabelSettings(): Promise<WhiteLabelSettings> {
    const result = await db.select().from(whiteLabelSettings).limit(1);
    if (result.length === 0) {
      // Create default settings if none exist
      const defaultSettings: InsertWhiteLabelSettings = {
        companyName: "Exterior Finishes",
        logo: null,
        primaryColor: "hsl(38.23, 87.6%, 74.71%)",
        secondaryColor: "hsl(39.27, 43.31%, 24.9%)",
        accentColor: "hsl(74.4, 39.68%, 87.65%)",
        domain: null,
        isActive: true,
      };
      return await this.updateWhiteLabelSettings(defaultSettings);
    }
    return result[0];
  }

  async updateWhiteLabelSettings(settings: InsertWhiteLabelSettings): Promise<WhiteLabelSettings> {
    const existing = await db.select().from(whiteLabelSettings).limit(1);
    
    if (existing.length === 0) {
      const result = await db.insert(whiteLabelSettings).values(settings).returning();
      return result[0];
    } else {
      const result = await db.update(whiteLabelSettings)
        .set(settings)
        .where(eq(whiteLabelSettings.id, existing[0].id))
        .returning();
      return result[0];
    }
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
    const totalLeadsResult = await db.select().from(leads);
    const activeEstimatesResult = await db.select().from(estimates).where(eq(estimates.status, 'pending'));
    const wonLeadsResult = await db.select().from(leads).where(eq(leads.status, 'won'));
    const approvedEstimatesResult = await db.select().from(estimates).where(eq(estimates.status, 'approved'));

    const totalLeads = totalLeadsResult.length;
    const activeEstimates = activeEstimatesResult.length;
    const wonLeads = wonLeadsResult.length;
    const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
    
    const closedDeals = approvedEstimatesResult.reduce((sum, e) => sum + Number(e.totalCost || 0), 0);

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