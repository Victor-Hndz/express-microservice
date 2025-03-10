import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRequestSchema, InsertRequest as RequestFormData } from "@shared/schema/schema";
import { FormatEnum, RangesEnum, TypesEnum, VariableEnum } from "@shared/enums/requests.enums";
import { apiRequest } from "@client/lib/queryClient";
import { useToast } from "@client/hooks/use-toast";
import { stringToNumberArray } from "@shared/utils/stringConvertion";

const DEFAULT_VALUES: RequestFormData = {
  variable: VariableEnum.Geopotential,
  pressureLevels: [],
  years: [],
  months: [],
  days: [],
  hours: [],
  area: [],
  types: [],
  ranges: [],
  levels: [],
  instants: [],
  isAll: false,
  format: undefined,
  outDir: "",
  tracking: false,
  debug: false,
  noCompile: false,
  noExecute: false,
  noCompileExecute: false,
  noMaps: false,
  animation: false,
  omp: false,
  mpi: false,
  nThreads: 1,
  nProces: 0,
};

export function useRequestForm() {
  const { toast } = useToast();
  const [location] = useLocation();
  const [isFullArea, setIsFullArea] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedRanges, setSelectedRanges] = useState<string[]>([]);

  const form = useForm<RequestFormData>({
    resolver: zodResolver(insertRequestSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const submitMutation = useMutation({
    mutationFn: async (data: RequestFormData) => {
      const res = await apiRequest("POST", "/api/requests", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Request submitted",
        description: "Your request has been saved and will be processed.",
      });
      form.reset(DEFAULT_VALUES);
      setSelectedTypes([]);
      setSelectedRanges([]);
      setIsFullArea(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Request failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Parse URL parameters for pre-filling form
  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1]);

    form.reset({
      ...DEFAULT_VALUES,
      variable: (params.get("variable") as VariableEnum) ?? DEFAULT_VALUES.variable,
      pressureLevels: stringToNumberArray(params.get("pressureLevels") ?? ""),
      years: stringToNumberArray(params.get("years") ?? ""),
      months: stringToNumberArray(params.get("months") ?? ""),
      days: stringToNumberArray(params.get("days") ?? ""),
      hours: stringToNumberArray(params.get("hours") ?? ""),
      area: stringToNumberArray(params.get("area") ?? ""),
      types: (params.getAll("types") as TypesEnum[]) ?? DEFAULT_VALUES.types,
      ranges: (params.getAll("ranges") as RangesEnum[]) ?? DEFAULT_VALUES.ranges,
      levels: stringToNumberArray(params.get("levels") ?? ""),
      instants: stringToNumberArray(params.get("instants") ?? ""),
      isAll: params.get("isAll") === "true",
      format: (params.get("format") as FormatEnum) ?? undefined,
      outDir: params.get("outDir") ?? "",
      tracking: params.get("tracking") === "true",
      debug: params.get("debug") === "true",
      noCompile: params.get("noCompile") === "true",
      noExecute: params.get("noExecute") === "true",
      noCompileExecute: params.get("noCompileExecute") === "true",
      noMaps: params.get("noMaps") === "true",
      animation: params.get("animation") === "true",
      omp: params.get("omp") === "true",
      mpi: params.get("mpi") === "true",
      nThreads: Number(params.get("nThreads")) || 1,
      nProces: Number(params.get("nProces")) || 0,
    });
  }, [location, form]);

  // Effect for handling full area checkbox
  useEffect(() => {
    if (isFullArea) {
      form.setValue("area", stringToNumberArray("90,-180,-90,180"));
    } else {
      form.setValue("area", stringToNumberArray("0,0,0,0"));
    }
  }, [isFullArea, form]);

  // Clear instants when isAll is toggled
  useEffect(() => {
    if (form.watch("isAll")) {
      form.setValue("instants", "");
    }
  }, [form.watch("isAll"), form]);

  const handleSubmit = form.handleSubmit((data) => {
    submitMutation.mutate(data);
  });

  const resetForm = () => {
    form.reset(DEFAULT_VALUES);
    setSelectedTypes([]);
    setSelectedRanges([]);
    setIsFullArea(false);
  };

  return {
    form,
    isFullArea,
    setIsFullArea,
    selectedTypes,
    setSelectedTypes,
    selectedRanges,
    setSelectedRanges,
    handleSubmit,
    resetForm,
    isSubmitting: submitMutation.isPending,
  };
}
