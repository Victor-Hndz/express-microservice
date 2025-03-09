import { z } from "zod";
import { insertRequestSchema } from "@shared/schema";

// Domain types
export type RequestFormData = z.infer<typeof insertRequestSchema>;

export interface AreaSettings {
  isFullArea: boolean;
  areaValues: string;
}

export interface MultiSelectState {
  selectedItems: string[];
  handleSelectAll: (checked: boolean) => void;
  handleSelectItem: (value: string, checked: boolean) => void;
}

export type RequestFormDefaultValues = {
  variable: undefined;
  pressureLevels: string;
  years: string;
  months: string;
  days: string;
  hours: string;
  area: string;
  types: string;
  ranges: string;
  levels: string;
  instants: string;
  isAll: boolean;
  format: undefined;
  outDir: string;
  tracking: boolean;
  debug: boolean;
  noCompile: boolean;
  noExecute: boolean;
  noCompileExecute: boolean;
  noMaps: boolean;
  animation: boolean;
  omp: boolean;
  mpi: boolean;
  nThreads: string;
  nProces: string;
};
