import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users)
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
    variable: z.enum(["geopotential", "temperature"], {
      required_error: "Variable is required",
    }),
    outDir: z.string().optional(),
    debug: z.boolean().default(false),
  });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertRequest = z.infer<typeof insertRequestSchema>;
export type Request = typeof requests.$inferSelect;
