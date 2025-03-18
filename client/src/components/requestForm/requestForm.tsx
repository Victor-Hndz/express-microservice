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

const RequestForm = () => {
  const { form, handleSubmit, resetForm, isSubmitting } = useRequestForm();

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {InputFieldsProps.map((fieldDef) => (
              <FormField
                key={fieldDef.name}
                control={form.control}
                name={fieldDef.name as keyof RequestFormInput}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {fieldDef.label}
                      {fieldDef.optional ? "" : " *"}
                    </FormLabel>
                    <FormControl>
                      <DynamicFormField field={field} fieldDef={fieldDef} />
                    </FormControl>
                    {fieldDef.description && (
                      <FormDescription>{fieldDef.description}</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>
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
