import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InsertRequest } from "@shared/schema/schema";
import { RequestFormInput, requestFormInputToInsertRequest } from "@shared/types/RequestFormInput";
import { apiRequest } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

// Form-specific validation schema that works with string values
const requestFormSchema = z.object({
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
  fileFormat: z.string().min(1, "File format is required"),
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
    resolver: zodResolver(requestFormSchema),
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
    if (params.size === 0) return;

    const formValues = { ...DEFAULT_VALUES };

    // Process each parameter if it exists
    for (const key of Object.keys(DEFAULT_VALUES) as Array<keyof RequestFormInput>) {
      const value = params.get(key);
      if (value !== null) {
        formValues[key] = value;
      }
    }

    form.reset(formValues);

    // Update related states
    setIsFullArea(formValues.areaCovered === "90,-180,-90,180");
    if (formValues.mapTypes) setSelectedTypes(formValues.mapTypes.split(","));
    if (formValues.mapRanges) setSelectedRanges(formValues.mapRanges.split(","));
  }, [location, form]);

  // Effect for handling full area checkbox
  useEffect(() => {
    if (isFullArea) {
      form.setValue("areaCovered", "90,-180,-90,180");
    } else {
      form.setValue("areaCovered", "");
    }
  }, [isFullArea, form]);

  const handleSubmit = form.handleSubmit(
    (data) => {
      try {
        // Ensure areaCovered has exactly 4 values if not empty
        if (data.areaCovered && data.areaCovered.split(",").length !== 4) {
          throw new Error("Area must have exactly 4 values");
        }

        // Convert the form data to InsertRequest format
        const requestData = requestFormInputToInsertRequest(data);
        console.log("Form data converted:", requestData);
        submitMutation.mutate(requestData);
      } catch (error) {
        console.error("Conversion error:", error);
        toast({
          title: "Validation Error",
          description: error instanceof Error ? error.message : "Invalid form data",
          variant: "destructive",
        });
      }
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
