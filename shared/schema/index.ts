import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Enums
 */
export enum Variable {
  Geopotential = "geopotential",
  Temperature = "temperature",
}

/**
 * Database Schema
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const requests = pgTable("requests", {
  id: serial("id").primaryKey(),
  variable: text("variable").notNull(),
  outDir: text("out_dir"),
  debug: boolean("debug").notNull(),
  userId: integer("user_id").references(() => users.id),
});

/**
 * Validation Schemas
 */
export const insertUserSchema = createInsertSchema(users)
  .pick({
    username: true,
    password: true,
  })
  .extend({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
  });

export const insertRequestSchema = createInsertSchema(requests)
  .pick({
    variable: true,
    outDir: true,
    debug: true,
  })
  .extend({
    variable: z.enum([Variable.Geopotential, Variable.Temperature], {
      required_error: "Variable is required",
    }),
    outDir: z.string().optional(),
    debug: z.boolean().default(false),
  });

/**
 * Database Entity Types
 */
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Request = typeof requests.$inferSelect;
export type InsertRequest = z.infer<typeof insertRequestSchema>;

/**
 * Form Types
 */
export type FormValues = z.infer<typeof insertRequestSchema>;
