import { UseFormReturn } from "react-hook-form";
import { VariableEnum } from "@shared/enums/requests.enums";
import { RequestFormInput } from "@shared/types/RequestFormInput";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface BasicSettingsProps {
  readonly form: UseFormReturn<RequestFormInput>;
}

export function BasicSettings({ form }: BasicSettingsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Basic Settings</h3>

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
                <SelectItem value={VariableEnum.Geopotential}>Geopotential</SelectItem>
                <SelectItem value={VariableEnum.Temperature}>Temperature</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {[
          { name: "pressureLevels", label: "Pressure Levels", placeholder: "e.g., 1000,850,700" },
          { name: "years", label: "Years", placeholder: "e.g., 2020,2021,2022" },
          { name: "months", label: "Months", placeholder: "e.g., 1,2,3" },
          { name: "days", label: "Days", placeholder: "e.g., 1,15,30" },
          { name: "hours", label: "Hours", placeholder: "e.g., 0,6,12,18" },
        ].map(({ name, label, placeholder }) => (
          <FormField
            key={name}
            control={form.control}
            name={name as keyof RequestFormInput}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={placeholder} />
                </FormControl>
                <FormDescription>Enter comma-separated values</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
}
