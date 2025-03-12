import { UseFormReturn } from "react-hook-form";
import { RequestFormInput } from "@shared/types/RequestFormInput";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface MultiSelectFieldProps {
  readonly form: UseFormReturn<RequestFormInput>;
  readonly name: "mapTypes" | "mapRanges";
  readonly label: string;
  readonly options: Record<string, string>;
  readonly selectedItems: string[];
  readonly onSelectAll: (checked: boolean) => void;
  readonly onSelectItem: (value: string, checked: boolean) => void;
}

export function MultiSelectField({
  form,
  name,
  label,
  options,
  selectedItems,
  onSelectAll,
  onSelectItem,
}: MultiSelectFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${label.toLowerCase()}...`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <div className="p-2 space-y-2">
                <div className="flex items-center space-x-2 pb-2 border-b">
                  <Checkbox
                    checked={selectedItems.length === Object.keys(options).length}
                    onCheckedChange={onSelectAll}
                  />
                  <span className="text-sm">Select All</span>
                </div>
                {Object.entries(options).map(([key, value]) => (
                  <div key={value} className="flex items-center space-x-2 py-1">
                    <Checkbox
                      checked={selectedItems.includes(value)}
                      onCheckedChange={(checked) => {
                        onSelectItem(value, checked as boolean);
                        const newItems = checked
                          ? [...selectedItems, value]
                          : selectedItems.filter((item) => item !== value);
                        field.onChange(newItems.join(","));
                      }}
                    />
                    <span className="text-sm">{key}</span>
                  </div>
                ))}
              </div>
            </SelectContent>
          </Select>
          {selectedItems.length > 0 && (
            <FormDescription>Selected: {selectedItems.join(", ")}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
