import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRequestSchema, InsertRequest } from "@shared/schema/schema";
import { RequestFormInput, requestFormInputToInsertRequest } from "@shared/types/RequestFormInput";
import { FormatEnum, RangesEnum, TypesEnum, VariableEnum } from "@shared/enums/requests.enums";
import { apiRequest } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_VALUES: RequestFormInput = {
  variableName: "",
  pressureLevels: "",
  years: "",
  months: "",
  days: "",
  hours: "",
  areaCovered: "",
  mapTypes: "",
  mapRanges: "",
  mapLevels: "",
  fileFormat: "",
  outDir: "",
  tracking: "false",
  debug: "false",
  noCompile: "false",
  noExecute: "false",
  noMaps: "false",
  animation: "false",
  omp: "false",
  mpi: "false",
  nThreads: "1",
  nProces: "0",
};

export function useRequestForm() {
  const { toast } = useToast();
  const [location] = useLocation();
  const [isFullArea, setIsFullArea] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedRanges, setSelectedRanges] = useState<string[]>([]);

  const form = useForm<RequestFormInput>({
    resolver: zodResolver(insertRequestSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertRequest) => {
      const res = await apiRequest<{ message: string }>("POST", "/api/requests", data);
      return res.message;
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
      variableName: params.get("variableName") as VariableEnum,
      pressureLevels: params.get("pressureLevels") as string,
      years: params.get("years") as string,
      months: params.get("months") as string,
      days: params.get("days") as string,
      hours: params.get("hours") as string,
      areaCovered: params.get("areaCovered") as string,
      mapTypes: params.get("mapTypes") as TypesEnum,
      mapRanges: params.get("mapRanges") as RangesEnum,
      mapLevels: params.get("mapLevels") as string,
      fileFormat: params.get("fileFormat") as FormatEnum,
      outDir: params.get("outDir") as string,
      tracking: params.get("tracking") as string,
      debug: params.get("debug") as string,
      noCompile: params.get("noCompile") as string,
      noExecute: params.get("noExecute") as string,
      noMaps: params.get("noMaps") as string,
      animation: params.get("animation") as string,
      omp: params.get("omp") as string,
      mpi: params.get("mpi") as string,
      nThreads: params.get("nThreads") as string,
      nProces: params.get("nProces") as string,
    });
  }, [location, form]);

  // Effect for handling full area checkbox
  useEffect(() => {
    if (isFullArea) {
      form.setValue("areaCovered", "90,-180,-90,180");
    } else {
      form.setValue("areaCovered", "0,0,0,0");
    }
  }, [isFullArea, form]);

  const handleSubmit = form.handleSubmit(
    (data) => {
      console.log("Form data:", data);
      submitMutation.mutate(requestFormInputToInsertRequest(data));
    },
    (errors) => {
      console.log("Validation errors:", errors);
    }
  );

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
