import { ControllerRenderProps } from "react-hook-form";
import { InputFieldProps } from "@shared/consts/inputFields";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { RequestFormInput } from "@shared/types/RequestFormInput";

interface DynamicFormFieldProps {
  field: ControllerRenderProps<RequestFormInput, keyof RequestFormInput>;
  fieldDef: InputFieldProps;
}

export const DynamicFormField = ({ field, fieldDef }: DynamicFormFieldProps) => {
  switch (fieldDef.inputType) {
    case "text":
    case "number":
      return (
        <Input
          {...field}
          type={fieldDef.inputType}
          placeholder={fieldDef.placeholder}
          value={field.value ?? ""}
        />
      );
    case "select":
      return (
        <Select onValueChange={field.onChange} value={(field.value as string) || ""}>
          <SelectTrigger>
            <SelectValue placeholder={fieldDef.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {fieldDef.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "multiselect": {
      let selectedValues: string[] = [];
      if (field.value) {
        if (typeof field.value === "string") {
          selectedValues = field.value.split(",").filter(Boolean);
        }
      }

      return (
        <div className="flex flex-wrap gap-2 p-2 border rounded-md">
          {fieldDef.options?.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`${field.name}-${option.value}`}
                checked={selectedValues.includes(option.value)}
                onCheckedChange={(checked) => {
                  let newValues = [...selectedValues];
                  if (checked) {
                    if (!newValues.includes(option.value)) {
                      newValues.push(option.value);
                    }
                  } else {
                    newValues = newValues.filter((val) => val !== option.value);
                  }
                  field.onChange(newValues.join(","));
                }}
              />
              <label htmlFor={`${field.name}-${option.value}`}>{option.label}</label>
            </div>
          ))}
        </div>
      );
    }
    case "checkbox":
      return (
        <Checkbox
          checked={field.value === "true"}
          onCheckedChange={(checked) => field.onChange(checked ? "true" : "false")}
        />
      );
    default:
      return <Input {...field} placeholder={fieldDef.placeholder} value={field.value ?? ""} />;
  }
};
