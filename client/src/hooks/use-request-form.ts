import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRequestSchema } from "@shared/schema";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { RequestFormData, RequestFormDefaultValues } from "@/types/request";

const DEFAULT_VALUES: RequestFormDefaultValues = {
  variable: undefined,
  pressureLevels: "",
  years: "",
  months: "",
  days: "",
  hours: "",
  area: "0,0,0,0",
  types: "",
  ranges: "",
  levels: "",
  instants: "",
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
  nThreads: "",
  nProces: "",
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
    const params = new URLSearchParams(location.split('?')[1]);
    const variable = params.get('variable');
    const outDir = params.get('outDir');
    const debug = params.get('debug');

    if (variable || outDir || debug) {
      form.reset({
        ...DEFAULT_VALUES,
        variable: variable as any || undefined,
        outDir: outDir || "",
        debug: debug === "true",
      });
    }
  }, [location, form]);

  // Effect for handling full area checkbox
  useEffect(() => {
    if (isFullArea) {
      form.setValue("area", "90,-180,-90,180");
    } else {
      form.setValue("area", "0,0,0,0");
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
