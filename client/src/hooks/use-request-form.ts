import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { InsertRequest } from "@shared/schema/schema";
import {
  RequestFormInput,
  requestFormInputToInsertRequest,
  requestFormSchema,
} from "@shared/types/RequestFormInput";
import { useToast } from "@/hooks/use-toast";
import { requestsService } from "@/services/requests";

const DEFAULT_VALUES: RequestFormInput = {
  variableName: "",
  pressureLevels: "",
  years: "",
  months: "",
  days: "",
  hours: "",
  areaCovered: "90,-180,-90,180",
  mapTypes: "",
  mapRanges: "",
  mapLevels: "20",
  fileFormat: "SVG",
  outDir: "/out",
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
      console.log("Submitting request: ", data);

      // Validate essential fields before sending
      if (!data.pressureLevels || data.pressureLevels.length === 0) {
        throw new Error("At least one pressure level is required");
      }

      // Use the service function instead of direct apiRequest
      const response = await requestsService.create(data);
      return response.id ? "Request created successfully" : "Success";
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
      console.error("Request failed:", error);

      // Provide more detailed error feedback
      const errorMessage = error.message.includes("400:")
        ? "Validation error: Please check all required fields"
        : error.message;

      toast({
        title: "Request failed",
        description: errorMessage,
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

        // Additional validation for pressureLevels
        if (!data.pressureLevels || data.pressureLevels.trim() === "") {
          throw new Error("At least one pressure level is required");
        }

        // Convert the form data to InsertRequest format
        const requestData = requestFormInputToInsertRequest(data);

        // Extra logging for debugging
        console.log("Form data converted:", requestData);
        console.log("Pressure levels:", requestData.pressureLevels);

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
