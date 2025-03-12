import { FormatEnum, RangesEnum, TypesEnum, VariableEnum } from "@shared/enums/requests.enums";
import { Request, InsertRequest } from "@shared/schema/schema";

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

export interface AreaSettings {
  isFullArea: boolean;
  areaValues: string;
}

//mapper to convert from RequestFormInput InsertRequestSchema
export const requestFormInputToInsertRequest = (data: RequestFormInput): InsertRequest => {
  return {
    variableName: data.variableName as VariableEnum,
    pressureLevels: JSON.parse(data.pressureLevels),
    years: JSON.parse(data.years),
    months: JSON.parse(data.months),
    days: JSON.parse(data.days),
    hours: JSON.parse(data.hours),
    areaCovered: JSON.parse(data.areaCovered),
    mapTypes: JSON.parse(data.mapTypes as TypesEnum),
    mapRanges: JSON.parse(data.mapRanges as RangesEnum),
    mapLevels: data.mapLevels ? JSON.parse(data.mapLevels) : undefined,
    fileFormat: data.fileFormat ? (data.fileFormat as FormatEnum) : undefined,
    outDir: data.outDir ? data.outDir : undefined,
    tracking: data.tracking === "true",
    debug: data.debug === "true",
    noCompile: data.noCompile === "true",
    noExecute: data.noExecute === "true",
    noMaps: data.noMaps === "true",
    animation: data.animation === "true",
    omp: data.omp === "true",
    mpi: data.mpi === "true",
    nThreads: data.nThreads ? parseInt(data.nThreads) : undefined,
    nProces: data.nProces ? parseInt(data.nProces) : undefined,
  };
};

//mapper to convert from InsertRequest to RequestFormInput
export const insertRequestToRequestFormInput = (
  data: InsertRequest | Request
): RequestFormInput => {
  return {
    variableName: data.variableName,
    pressureLevels: JSON.stringify(data.pressureLevels),
    years: JSON.stringify(data.years),
    months: JSON.stringify(data.months),
    days: JSON.stringify(data.days),
    hours: JSON.stringify(data.hours),
    areaCovered: JSON.stringify(data.areaCovered),
    mapTypes: JSON.stringify(data.mapTypes),
    mapRanges: JSON.stringify(data.mapRanges),
    mapLevels: data.mapLevels ? JSON.stringify(data.mapLevels) : "",
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
