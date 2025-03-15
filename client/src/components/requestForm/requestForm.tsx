import { useForm, SubmitHandler } from "react-hook-form";
import { RefreshCw, Send } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { VariableEnum } from "@shared/enums/requests.enums";
import { Input } from "@/components/ui/input";
import { InputFieldsProps } from "@shared/consts/inputFields";

const RequestForm = () => {
  const form = useForm<RequestFormInput>();
  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<RequestFormInput> = (data) => {
    console.log(data);
  };

  const resetForm = () => {
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="variableName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variable</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a variable..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={VariableEnum.Geopotential.toString()}>
                      {VariableEnum.Geopotential}
                    </SelectItem>
                    <SelectItem value={VariableEnum.Temperature.toString()}>
                      {VariableEnum.Temperature}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 md:grid-cols-2">
            {InputFieldsProps.map(({ name, label, placeholder }) => (
              <FormField
                key={name}
                control={form.control}
                name={name as keyof RequestFormInput}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={placeholder} value={field.value ?? ""} />
                    </FormControl>
                    <FormDescription>Enter comma-separated values</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            <Send className="h-4 w-4 mr-2" />
            Submit Request
          </Button>
          <Button type="button" variant="outline" onClick={resetForm}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear Form
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RequestForm;
