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
        <Select onValueChange={field.onChange} value={field.value as string}>
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
    case "multiselect":
      // A basic implementation - you may want to use a more sophisticated component
      return (
        <div className="flex flex-wrap gap-2 p-2 border rounded-md">
          {fieldDef.options?.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`${field.name}-${option.value}`}
                checked={((field.value as string) || "").includes(option.value)}
                onCheckedChange={(checked) => {
                  const values = ((field.value as string) || "").split(",").filter(Boolean);
                  if (checked) {
                    if (!values.includes(option.value)) {
                      values.push(option.value);
                    }
                  } else {
                    const index = values.indexOf(option.value);
                    if (index !== -1) {
                      values.splice(index, 1);
                    }
                  }
                  field.onChange(values.join(","));
                }}
              />
              <label htmlFor={`${field.name}-${option.value}`}>{option.label}</label>
            </div>
          ))}
        </div>
      );
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
