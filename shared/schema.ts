import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const divisionEnum = pgEnum("division", ["rr", "multi-family", "single-family"]);
export const priorityEnum = pgEnum("priority", ["low", "medium", "high"]);
export const leadStatusEnum = pgEnum("lead_status", ["new", "contacted", "estimate_requested", "quote_sent", "won", "lost"]);
export const projectTypeEnum = pgEnum("project_type", ["siding", "repair", "replacement", "maintenance", "roofing", "windows"]);
export const estimateStatusEnum = pgEnum("estimate_status", ["draft", "pending", "approved", "rejected"]);
export const jobStatusEnum = pgEnum("job_status", ["scheduled", "in_progress", "completed", "cancelled"]);
export const communicationTypeEnum = pgEnum("communication_type", ["email", "phone", "meeting", "note"]);
export const themeEnum = pgEnum("theme", ["light", "dark", "system"]);
export const notificationFrequencyEnum = pgEnum("notification_frequency", ["immediate", "daily", "weekly", "never"]);
export const teamPositionEnum = pgEnum("team_position", ["owner", "operations-manager", "sales-marketing-manager", "estimator", "field-management", "accounting"]);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull().default("user"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User Settings table
export const userSettings = pgTable("user_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  theme: themeEnum("theme").notNull().default("system"),
  language: text("language").notNull().default("en"),
  timezone: text("timezone").notNull().default("America/New_York"),
  emailNotifications: boolean("email_notifications").notNull().default(true),
  emailDigestFrequency: notificationFrequencyEnum("email_digest_frequency").notNull().default("daily"),
  newLeadEmail: boolean("new_lead_email").notNull().default(true),
  leadAssignmentEmail: boolean("lead_assignment_email").notNull().default(true),
  estimateReminderEmail: boolean("estimate_reminder_email").notNull().default(true),
  deadlineAlertEmail: boolean("deadline_alert_email").notNull().default(true),
  weeklyReportEmail: boolean("weekly_report_email").notNull().default(false),
  newLeadInApp: boolean("new_lead_in_app").notNull().default(true),
  leadAssignmentInApp: boolean("lead_assignment_in_app").notNull().default(true),
  estimateReminderInApp: boolean("estimate_reminder_in_app").notNull().default(true),
  deadlineAlertInApp: boolean("deadline_alert_in_app").notNull().default(true),
  urgentLeadSMS: boolean("urgent_lead_sms").notNull().default(false),
  deadlineAlertSMS: boolean("deadline_alert_sms").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Customers table
export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Leads table
export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").references(() => customers.id),
  customerName: text("customer_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address").notNull(),
  division: divisionEnum("division").notNull(),
  projectType: projectTypeEnum("project_type").notNull(),
  priority: priorityEnum("priority").notNull().default("medium"),
  status: leadStatusEnum("status").notNull().default("new"),
  estimatedValue: decimal("estimated_value", { precision: 10, scale: 2 }),
  assignedTo: varchar("assigned_to").references(() => users.id),
  notes: text("notes"),
  source: text("source"),
  attachments: text("attachments").array().default(sql`'{}'`),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Estimates table
export const estimates = pgTable("estimates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").references(() => leads.id),
  customerId: varchar("customer_id").references(() => customers.id),
  title: text("title").notNull(),
  description: text("description"),
  materialsCost: decimal("materials_cost", { precision: 10, scale: 2 }),
  laborCost: decimal("labor_cost", { precision: 10, scale: 2 }),
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }).notNull(),
  status: estimateStatusEnum("status").notNull().default("draft"),
  validUntil: timestamp("valid_until"),
  createdBy: varchar("created_by").references(() => users.id),
  approvedBy: varchar("approved_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Jobs table
export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  estimateId: varchar("estimate_id").references(() => estimates.id),
  customerId: varchar("customer_id").references(() => customers.id),
  title: text("title").notNull(),
  description: text("description"),
  status: jobStatusEnum("status").notNull().default("scheduled"),
  scheduledStart: timestamp("scheduled_start"),
  actualStart: timestamp("actual_start"),
  scheduledEnd: timestamp("scheduled_end"),
  actualEnd: timestamp("actual_end"),
  assignedTo: varchar("assigned_to").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Communications table
export const communications = pgTable("communications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").references(() => leads.id),
  customerId: varchar("customer_id").references(() => customers.id),
  userId: varchar("user_id").references(() => users.id),
  type: communicationTypeEnum("type").notNull(),
  subject: text("subject"),
  content: text("content"),
  emailMessageId: text("email_message_id"), // For Outlook integration
  attachments: text("attachments").array(),
  scheduledFor: timestamp("scheduled_for"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Vendors table
export const vendors = pgTable("vendors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  contactPerson: text("contact_person"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  category: text("category"), // e.g., "materials", "subcontractor"
  rating: integer("rating"), // 1-5 rating
  notes: text("notes"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// File attachments table
export const fileAttachments = pgTable("file_attachments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").references(() => leads.id),
  estimateId: varchar("estimate_id").references(() => estimates.id),
  jobId: varchar("job_id").references(() => jobs.id),
  originalName: text("original_name").notNull(),
  fileName: text("file_name").notNull(), // Unique filename on disk
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size").notNull(), // Size in bytes
  mimeType: text("mime_type").notNull(),
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// White label settings table
export const whiteLabelSettings = pgTable("white_label_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull(),
  logo: text("logo"),
  primaryColor: text("primary_color"),
  secondaryColor: text("secondary_color"),
  accentColor: text("accent_color"),
  domain: text("domain"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Team members table
export const teamMembers = pgTable("team_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  position: teamPositionEnum("position").notNull(),
  division: divisionEnum("division").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  hireDate: timestamp("hire_date"),
  phone: text("phone"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEstimateSchema = createInsertSchema(estimates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommunicationSchema = createInsertSchema(communications).omit({
  id: true,
  createdAt: true,
});

export const insertVendorSchema = createInsertSchema(vendors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFileAttachmentSchema = createInsertSchema(fileAttachments).omit({
  id: true,
  createdAt: true,
});

export const insertWhiteLabelSettingsSchema = createInsertSchema(whiteLabelSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;

export type Estimate = typeof estimates.$inferSelect;
export type InsertEstimate = z.infer<typeof insertEstimateSchema>;

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;

export type Communication = typeof communications.$inferSelect;
export type InsertCommunication = z.infer<typeof insertCommunicationSchema>;

export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = z.infer<typeof insertVendorSchema>;

export type FileAttachment = typeof fileAttachments.$inferSelect;
export type InsertFileAttachment = z.infer<typeof insertFileAttachmentSchema>;

export type WhiteLabelSettings = typeof whiteLabelSettings.$inferSelect;
export type InsertWhiteLabelSettings = z.infer<typeof insertWhiteLabelSettingsSchema>;

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
