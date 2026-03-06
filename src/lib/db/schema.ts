import { pgTable, serial, text, timestamp, uuid, boolean, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table (extends Kinde user)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  kindeId: text('kinde_id').unique().notNull(),
  email: text('email').notNull(),
  fullName: text('full_name').notNull(),
  phone: text('phone'),
  address: text('address'), // Added for parent's residential address
  role: text('role').$type<'admin' | 'parent'>().notNull().default('parent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Players table
export const players = pgTable('players', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  dateOfBirth: timestamp('date_of_birth').notNull(),
  ageGroup: text('age_group').$type<'U13' | 'U14' | 'U15' | 'U17' | 'U19'>().notNull(),
  status: text('status').$type<'active' | 'archived' | 'transferred'>().notNull().default('active'),
  parentId: uuid('parent_id').references(() => users.id, { onDelete: 'cascade' }),
  phone: text('phone'), // player's phone
  address: text('address'), // player's residential address (if different from parent)
  emergencyContactName: text('emergency_contact_name'),
  emergencyContactPhone: text('emergency_contact_phone'),
  medicalNotes: text('medical_notes'), // existing
  // New fields for player bio
  placeOfBirth: text('place_of_birth'),
  mysafaId: text('mysafa_id'),
  nationalId: text('national_id'),
  nationality: text('nationality'),
  previousClub: text('previous_club'),
  position: text('position'),
  season: text('season'), // e.g., '2026'
  // New fields for registration management
  registrationStatus: text('registration_status').$type<'pending' | 'accepted' | 'rejected'>().notNull().default('pending'),
  termsAccepted: boolean('terms_accepted').notNull().default(false),
  termsAcceptedAt: timestamp('terms_accepted_at'),
  parentSignature: text('parent_signature'), // could store name or actual signature data
  playerSignature: text('player_signature'),
  // Consent fields (from the contract's consent form)
  consentPhotos: boolean('consent_photos').notNull().default(false),
  consentVideos: boolean('consent_videos').notNull().default(false),
  consentTravel: boolean('consent_travel').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Invoices table
export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  parentId: uuid('parent_id').references(() => users.id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(),
  dueDate: timestamp('due_date').notNull(),
  status: text('status').$type<'pending' | 'paid' | 'overdue'>().notNull().default('pending'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Payments table
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  invoiceId: uuid('invoice_id').references(() => invoices.id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(),
  paymentDate: timestamp('payment_date').defaultNow().notNull(),
  proofUrl: text('proof_url'),
  status: text('status').$type<'pending' | 'confirmed' | 'rejected'>().notNull().default('pending'),
  uploadedBy: uuid('uploaded_by').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Notifications table (optional - for in-app messages)
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  message: text('message').notNull(),
  read: boolean('read').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  players: many(players),
  invoices: many(invoices),
  payments: many(payments),
}));

export const playersRelations = relations(players, ({ one }) => ({
  parent: one(users, {
    fields: [players.parentId],
    references: [users.id],
  }),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  parent: one(users, {
    fields: [invoices.parentId],
    references: [users.id],
  }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  invoice: one(invoices, {
    fields: [payments.invoiceId],
    references: [invoices.id],
  }),
  uploadedBy: one(users, {
    fields: [payments.uploadedBy],
    references: [users.id],
  }),
}));

// Notifications relations
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));