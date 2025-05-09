import { pgTable, serial, text, boolean, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { VariableEnum, TypesEnum, RangesEnum, FormatEnum } from "@shared/enums/requests.enums";
import {
  advancedPressureLevelsOptions,
  simplePressureLevelsOptions,
} from "@shared/consts/pressureLevelsOptions";

function isSubsetOf(arr: number[], set: Set<number>): boolean {
  return arr.every((item) => set.has(item));
}

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const requests = pgTable("requests", {
  id: serial("id").primaryKey(),
  variableName: text("variableName").notNull(),
  pressureLevels: jsonb("pressureLevels").$type<number[]>().notNull(),
  years: jsonb("years").$type<number[]>().notNull(),
  months: jsonb("months").$type<number[]>().notNull(),
  days: jsonb("days").$type<number[]>().notNull(),
  hours: jsonb("hours").$type<number[]>().notNull(),
  areaCovered: jsonb("areaCovered").$type<number[]>().notNull(),
  mapTypes: jsonb("mapTypes").$type<string[]>().notNull(),
  mapRanges: jsonb("mapRanges").$type<string[]>().notNull(),
  mapLevels: jsonb("mapLevels").$type<number[]>(),
  fileFormat: text("fileFormat"),
  outDir: text("outDir"),
  tracking: boolean("tracking"),
  debug: boolean("debug"),
  noCompile: boolean("noCompile"),
  noExecute: boolean("noExecute"),
  noMaps: boolean("no_maps"),
  animation: boolean("animation"),
  omp: boolean("omp"),
  mpi: boolean("mpi"),
  nThreads: integer("nThreads"),
  nProces: integer("nProces"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: integer("user_id").references(() => users.id),
});

export const insertUserSchema = createInsertSchema(users).extend({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const insertRequestSchema = createInsertSchema(requests).extend({
  variableName: z.enum([VariableEnum.Geopotential, VariableEnum.Temperature], {
    required_error: "Variable name is required",
  }),
  pressureLevels: z
    .number()
    .array()
    .min(1, "At least one pressure level is required")
    .refine(
      (arr) =>
        isSubsetOf(arr, simplePressureLevelsOptions) ||
        isSubsetOf(arr, advancedPressureLevelsOptions),
      {
        message: "pressureLevels must only contain valid values (simple or advanced sets).",
      }
    ),
  years: z.number().array().min(1, "At least one year is required"),
  months: z.number().array().min(1, "At least one month is required"),
  days: z.number().array().min(1, "At least one day is required"),
  hours: z.number().array().min(1, "At least one hour is required"),
  areaCovered: z
    .number()
    .array()
    .length(4, "Area must have exactly 4 values")
    .default([90, -180, -90, 180]),
  mapTypes: z
    .enum([TypesEnum.Cont, TypesEnum.Disp, TypesEnum.Comb, TypesEnum.Forms])
    .array()
    .min(1, "At least one type is required"),
  mapRanges: z
    .enum([RangesEnum.Max, RangesEnum.Min, RangesEnum.Both, RangesEnum.Comb])
    .array()
    .min(1, "At least one range is required"),
  mapLevels: z.number().array().optional().default([20]),
  fileFormat: z
    .enum([FormatEnum.PNG, FormatEnum.JPG, FormatEnum.JPEG, FormatEnum.PDF, FormatEnum.SVG])
    .optional()
    .default(FormatEnum.SVG),
  outDir: z.string().optional(),
  tracking: z.boolean().optional(),
  debug: z.boolean().optional(),
  noCompile: z.boolean().optional(),
  noExecute: z.boolean().optional(),
  noMaps: z.boolean().optional(),
  animation: z.boolean().optional(),
  omp: z.boolean().optional(),
  mpi: z.boolean().optional(),
  nThreads: z.preprocess((val) => (val === "" ? undefined : Number(val)), z.number().optional()),
  nProces: z.preprocess((val) => (val === "" ? undefined : Number(val)), z.number().optional()),
});

export type User = typeof users.$inferSelect;
export type InsertUser = Omit<z.infer<typeof insertUserSchema>, "id">;
export type Request = typeof requests.$inferSelect;
export type InsertRequest = Omit<
  z.infer<typeof insertRequestSchema>,
  "id" | "createdAt" | "userId"
>;
