export type InputFieldOption = {
  value: string;
  label: string;
};

export type InputFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  optional: boolean;
  inputType: "text" | "number" | "select" | "multiselect" | "checkbox";
  options?: InputFieldOption[];
  description?: string;
};

export const InputFieldsProps: InputFieldProps[] = [
  {
    name: "variableName",
    label: "Variable",
    placeholder: "Choose a variable...",
    optional: false,
    inputType: "select",
    options: [
      { value: "geopotential", label: "Geopotential" },
      { value: "temperature", label: "Temperature" },
    ],
  },
  {
    name: "pressureLevels",
    label: "Pressure Levels",
    placeholder: "e.g., 1000,850,700",
    optional: false,
    inputType: "text",
    description: "Enter comma-separated values",
  },
  {
    name: "years",
    label: "Years",
    placeholder: "e.g., 2020,2021,2022",
    optional: false,
    inputType: "text",
    description: "Enter comma-separated values",
  },
  {
    name: "months",
    label: "Months",
    placeholder: "e.g., 1,2,3",
    optional: false,
    inputType: "text",
    description: "Enter comma-separated values",
  },
  {
    name: "days",
    label: "Days",
    placeholder: "e.g., 1,15,30",
    optional: false,
    inputType: "text",
    description: "Enter comma-separated values",
  },
  {
    name: "hours",
    label: "Hours",
    placeholder: "e.g., 0,6,12,18",
    optional: false,
    inputType: "text",
    description: "Enter comma-separated values",
  },
];
