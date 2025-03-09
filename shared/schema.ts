import { pgTable, serial, text, boolean, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Enums
export const VariableEnum = {
  Geopotential: "geopotential",
  Temperature: "temperature",
} as const;

export const TypesEnum = {
  Cont: "cont",
  Disp: "disp",
  Comb: "comb",
  Forms: "forms",
} as const;

export const RangesEnum = {
  Max: "max",
  Min: "min",
  Both: "both",
  Comb: "comb",
} as const;

export const FormatEnum = {
  PNG: "png",
  JPG: "jpg",
  JPEG: "jpeg",
  PDF: "pdf",
  SVG: "svg",
} as const;

export const requests = pgTable("requests", {
  id: serial("id").primaryKey(),
  variable: text("variable").notNull(),
  pressureLevels: jsonb("pressure_levels").$type<number[]>().notNull(),
  years: jsonb("years").$type<number[]>().notNull(),
  months: jsonb("months").$type<number[]>().notNull(),
  days: jsonb("days").$type<number[]>().notNull(),
  hours: jsonb("hours").$type<number[]>().notNull(),
  area: jsonb("area").$type<number[]>().notNull(),
  types: jsonb("types").$type<string[]>().notNull(),
  ranges: jsonb("ranges").$type<string[]>().notNull(),
  levels: jsonb("levels").$type<number[]>().notNull(),
  instants: jsonb("instants").$type<number[]>(),
  isAll: boolean("is_all"),
  format: text("format"),
  outDir: text("out_dir"),
  tracking: boolean("tracking"),
  debug: boolean("debug"),
  noCompile: boolean("no_compile"),
  noExecute: boolean("no_execute"),
  noCompileExecute: boolean("no_compile_execute"),
  noMaps: boolean("no_maps"),
  animation: boolean("animation"),
  omp: boolean("omp"),
  mpi: boolean("mpi"),
  nThreads: integer("n_threads"),
  nProces: integer("n_proces"),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users)
  .extend({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
  });

// Helper function to convert comma-separated string to number array
const stringToNumberArray = (value: unknown) =>
  typeof value === "string"
    ? value.split(",").map((s) => Number(s.trim())).filter((n) => !isNaN(n))
    : value;

// Helper function to convert comma-separated string to string array
const stringToStringArray = (value: unknown) =>
  typeof value === "string"
    ? value.split(",").map((s) => s.trim()).filter(Boolean)
    : value;

export const insertRequestSchema = createInsertSchema(requests)
  .extend({
    variable: z.enum([VariableEnum.Geopotential, VariableEnum.Temperature], {
      required_error: "Variable is required",
    }),
    pressureLevels: z.preprocess(
      stringToNumberArray,
      z.number().array().min(1, "At least one pressure level is required")
    ),
    years: z.preprocess(
      stringToNumberArray,
      z.number().array().min(1, "At least one year is required")
    ),
    months: z.preprocess(
      stringToNumberArray,
      z.number().array().min(1, "At least one month is required")
    ),
    days: z.preprocess(
      stringToNumberArray,
      z.number().array().min(1, "At least one day is required")
    ),
    hours: z.preprocess(
      stringToNumberArray,
      z.number().array().min(1, "At least one hour is required")
    ),
    area: z.preprocess(
      stringToNumberArray,
      z.number().array().length(4, "Area must have exactly 4 values").default([90, -180, -90, 180])
    ),
    types: z.preprocess(
      stringToStringArray,
      z.enum([TypesEnum.Cont, TypesEnum.Disp, TypesEnum.Comb, TypesEnum.Forms])
        .array()
        .min(1, "At least one type is required")
    ),
    ranges: z.preprocess(
      stringToStringArray,
      z.enum([RangesEnum.Max, RangesEnum.Min, RangesEnum.Both, RangesEnum.Comb])
        .array()
        .min(1, "At least one range is required")
    ),
    levels: z.preprocess(
      stringToNumberArray,
      z.number().array().min(1, "At least one level is required")
    ),
    instants: z.preprocess(
      stringToNumberArray,
      z.number().array().optional()
    ),
    isAll: z.boolean().optional(),
    format: z.enum([FormatEnum.PNG, FormatEnum.JPG, FormatEnum.JPEG, FormatEnum.PDF, FormatEnum.SVG]).optional(),
    outDir: z.string().optional(),
    tracking: z.boolean().optional(),
    debug: z.boolean().optional(),
    noCompile: z.boolean().optional(),
    noExecute: z.boolean().optional(),
    noCompileExecute: z.boolean().optional(),
    noMaps: z.boolean().optional(),
    animation: z.boolean().optional(),
    omp: z.boolean().optional(),
    mpi: z.boolean().optional(),
    nThreads: z.preprocess((val) => val === "" ? undefined : Number(val), z.number().optional()),
    nProces: z.preprocess((val) => val === "" ? undefined : Number(val), z.number().optional()),
  })
  .refine(
    (data) => {
      // If 'isAll' is true, instants should be undefined or empty
      if (data.isAll && data.instants && data.instants.length > 0) {
        return false;
      }
      // If 'isAll' is false, instants should have at least one value
      if (!data.isAll && (!data.instants || data.instants.length === 0)) {
        return false;
      }
      return true;
    },
    {
      message: "When 'All' is selected, instants should be empty. When 'All' is not selected, instants are required.",
    }
  );

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertRequest = z.infer<typeof insertRequestSchema>;
export type Request = typeof requests.$inferSelect;