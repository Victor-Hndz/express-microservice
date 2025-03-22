import { FormatEnum, RangesEnum, TypesEnum, VariableEnum } from "@shared/enums/requests.enums";
import { Request, InsertRequest } from "@shared/schema/schema";
import { z } from "zod";

export type RequestFormInput = {
  variableName: string;
  pressureLevels: string;
  years: string;
  months: string;
  days: string;
  hours: string;
  areaCovered: string;
  mapTypes: string;
  mapRanges: string;
  mapLevels?: string;
  fileFormat?: string;
  outDir?: string;
  tracking?: string;
  debug?: string;
  noCompile?: string;
  noExecute?: string;
  noMaps?: string;
  animation?: string;
  omp?: string;
  mpi?: string;
  nThreads?: string;
  nProces?: string;
};

export const requestFormSchema = z.object({
  variableName: z.string().min(1, "Variable name is required"),
  pressureLevels: z.string().min(1, "At least one pressure level is required"),
  years: z.string().min(1, "At least one year is required"),
  months: z.string().min(1, "At least one month is required"),
  days: z.string().min(1, "At least one day is required"),
  hours: z.string().min(1, "At least one hour is required"),
  areaCovered: z.string().min(1, "Area covered is required"),
  mapTypes: z.string().min(1, "At least one map type is required"),
  mapRanges: z.string().min(1, "At least one map range is required"),
  mapLevels: z.string().optional(),
  fileFormat: z.string().optional(),
  outDir: z.string().optional(),
  tracking: z.string().optional(),
  debug: z.string().optional(),
  noCompile: z.string().optional(),
  noExecute: z.string().optional(),
  noMaps: z.string().optional(),
  animation: z.string().optional(),
  omp: z.string().optional(),
  mpi: z.string().optional(),
  nThreads: z.string().optional(),
  nProces: z.string().optional(),
});

export interface AreaSettings {
  isFullArea: boolean;
  areaValues: string;
}

//mapper to convert from RequestFormInput InsertRequestSchema
export const requestFormInputToInsertRequest = (data: RequestFormInput): InsertRequest => {
  // Ensure areaCovered has exactly 4 values
  const areaCoveredArray = data.areaCovered ? data.areaCovered.split(",").map(Number) : [];
  if (areaCoveredArray.length !== 4) {
    throw new Error("Area covered must have exactly 4 values");
  }

  // Ensure we have valid fileFormat
  if (!data.fileFormat || !Object.values(FormatEnum).includes(data.fileFormat as FormatEnum)) {
    throw new Error("Valid file format is required");
  }

  return {
    variableName: data.variableName as VariableEnum,
    pressureLevels: data.pressureLevels ? data.pressureLevels.split(",").map(Number) : [],
    years: data.years ? data.years.split(",").map(Number) : [],
    months: data.months ? data.months.split(",").map(Number) : [],
    days: data.days ? data.days.split(",").map(Number) : [],
    hours: data.hours ? data.hours.split(",").map(Number) : [],
    areaCovered: areaCoveredArray,
    mapTypes: data.mapTypes ? (data.mapTypes.split(",") as TypesEnum[]) : [],
    mapRanges: data.mapRanges ? (data.mapRanges.split(",") as RangesEnum[]) : [],
    mapLevels: data.mapLevels ? data.mapLevels.split(",").map(Number) : [],
    fileFormat: data.fileFormat as FormatEnum,
    outDir: data.outDir ?? undefined,
    tracking: data.tracking === "true",
    debug: data.debug === "true",
    noCompile: data.noCompile === "true",
    noExecute: data.noExecute === "true",
    noMaps: data.noMaps === "true",
    animation: data.animation === "true",
    omp: data.omp === "true",
    mpi: data.mpi === "true",
    nThreads: data.nThreads?.trim() ? parseInt(data.nThreads) : undefined,
    nProces: data.nProces?.trim() ? parseInt(data.nProces) : undefined,
  };
};

//mapper to convert from InsertRequest to RequestFormInput
export const insertRequestToRequestFormInput = (
  data: InsertRequest | Request
): RequestFormInput => {
  return {
    variableName: data.variableName,
    pressureLevels: Array.isArray(data.pressureLevels) ? data.pressureLevels.join(",") : "",
    years: Array.isArray(data.years) ? data.years.join(",") : "",
    months: Array.isArray(data.months) ? data.months.join(",") : "",
    days: Array.isArray(data.days) ? data.days.join(",") : "",
    hours: Array.isArray(data.hours) ? data.hours.join(",") : "",
    areaCovered: Array.isArray(data.areaCovered) ? data.areaCovered.join(",") : "",
    mapTypes: Array.isArray(data.mapTypes) ? data.mapTypes.join(",") : "",
    mapRanges: Array.isArray(data.mapRanges) ? data.mapRanges.join(",") : "",
    mapLevels: Array.isArray(data.mapLevels) ? data.mapLevels.join(",") : "",
    fileFormat: data.fileFormat ? data.fileFormat : "",
    outDir: data.outDir ? data.outDir : "",
    tracking: data.tracking ? "true" : "false",
    debug: data.debug ? "true" : "false",
    noCompile: data.noCompile ? "true" : "false",
    noExecute: data.noExecute ? "true" : "false",
    noMaps: data.noMaps ? "true" : "false",
    animation: data.animation ? "true" : "false",
    omp: data.omp ? "true" : "false",
    mpi: data.mpi ? "true" : "false",
    nThreads: data.nThreads ? data.nThreads.toString() : "",
    nProces: data.nProces ? data.nProces.toString() : "",
  };
};
