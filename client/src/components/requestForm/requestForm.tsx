import { RefreshCw, Send, Loader2 } from "lucide-react";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { type RequestFormInput } from "@shared/types/RequestFormInput";
import { Button } from "@/components/ui/button";
import { InputFieldsProps } from "@shared/consts/inputFields";
import { useRequestForm } from "@/hooks/use-request-form";
import { DynamicFormField } from "./dynamic-form-field";

// Group fields by category for better organization
const fieldGroups = [
  {
    title: "Basic Information",
    fields: ["variableName", "pressureLevels", "years", "months", "days", "hours"],
  },
  {
    title: "Area Configuration",
    fields: ["areaCovered"],
  },
  {
    title: "Map Configuration",
    fields: ["mapTypes", "mapRanges", "mapLevels"],
  },
  {
    title: "Output Configuration",
    fields: ["fileFormat", "outDir"],
  },
  {
    title: "Processing Options",
    fields: ["tracking", "debug", "noCompile", "noExecute", "noMaps", "animation"],
  },
  {
    title: "Parallel Processing",
    fields: ["omp", "mpi", "nThreads", "nProces"],
  },
];

const RequestForm = () => {
  const { form, handleSubmit, resetForm, isSubmitting, isFullArea, setIsFullArea } =
    useRequestForm();

  // Create a map for quick field lookup
  const fieldsMap = InputFieldsProps.reduce(
    (map, field) => {
      map[field.name] = field;
      return map;
    },
    {} as Record<string, (typeof InputFieldsProps)[0]>
  );

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-8">
        {fieldGroups.map((group) => (
          <div key={group.title} className="space-y-4">
            <h3 className="text-lg font-medium">{group.title}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {group.fields.map((fieldName) => {
                const fieldDef = fieldsMap[fieldName];
                if (!fieldDef) return null;

                if (fieldName === "areaCovered") {
                  return (
                    <div key={fieldName} className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name="areaCovered"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Area Coverage *</FormLabel>
                            <div className="flex items-center space-x-2 mb-2">
                              <input
                                type="checkbox"
                                id="fullArea"
                                checked={isFullArea}
                                onChange={() => setIsFullArea(!isFullArea)}
                                className="h-4 w-4"
                              />
                              <label htmlFor="fullArea" className="text-sm">
                                Use full area (90,-180,-90,180)
                              </label>
                            </div>
                            {!isFullArea && (
                              <FormControl>
                                <DynamicFormField field={field} fieldDef={fieldDef} />
                              </FormControl>
                            )}
                            <FormDescription>
                              Enter 4 comma-separated values: north, west, south, east
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  );
                }

                return (
                  <FormField
                    key={fieldDef.name}
                    control={form.control}
                    name={fieldDef.name as keyof RequestFormInput}
                    render={({ field }) => (
                      <FormItem
                        className={
                          fieldDef.inputType === "checkbox"
                            ? "flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                            : ""
                        }
                      >
                        <FormLabel className={fieldDef.inputType === "checkbox" ? "mt-1" : ""}>
                          {fieldDef.label}
                          {fieldDef.optional ? "" : " *"}
                        </FormLabel>
                        <div
                          className={
                            fieldDef.inputType === "checkbox" ? "space-y-1 leading-none" : ""
                          }
                        >
                          <FormControl>
                            <DynamicFormField field={field} fieldDef={fieldDef} />
                          </FormControl>
                          {fieldDef.description && (
                            <FormDescription>{fieldDef.description}</FormDescription>
                          )}
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex gap-4">
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
          <Button type="button" variant="outline" onClick={resetForm} disabled={isSubmitting}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear Form
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RequestForm;
