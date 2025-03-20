import { FormatEnum, RangesEnum, TypesEnum, VariableEnum } from "@shared/enums/requests.enums";

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

enum labelCasingEnum {
  lowerCase = "lowerCase",
  upperCase = "upperCase",
  capitalize = "capitalize",
}

// Helper function to convert enum to options
const enumToOptions = (
  enumObject: Record<string, string>,
  labelCasing: labelCasingEnum
): InputFieldOption[] => {
  return Object.values(enumObject).map((value) => {
    let label: string;
    switch (labelCasing) {
      case labelCasingEnum.lowerCase:
        label = value.toLowerCase();
        break;
      case labelCasingEnum.upperCase:
        label = value.toUpperCase();
        break;
      case labelCasingEnum.capitalize:
      default:
        label = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        break;
    }
    return { value, label };
  });
};

export const InputFieldsProps: InputFieldProps[] = [
  {
    name: "variableName",
    label: "Variable",
    placeholder: "Choose a variable...",
    optional: false,
    inputType: "select",
    options: enumToOptions(VariableEnum, labelCasingEnum.capitalize),
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
  // Map configuration fields
  {
    name: "mapTypes",
    label: "Map Types",
    placeholder: "Select map types",
    optional: false,
    inputType: "multiselect",
    options: enumToOptions(TypesEnum, labelCasingEnum.lowerCase),
    description: "Select one or more map types",
  },
  {
    name: "mapRanges",
    label: "Map Ranges",
    placeholder: "Select map ranges",
    optional: false,
    inputType: "multiselect",
    options: enumToOptions(RangesEnum, labelCasingEnum.lowerCase),
    description: "Select one or more map range types",
  },
  {
    name: "mapLevels",
    label: "Map Levels",
    placeholder: "e.g., 1000,850,700",
    optional: true,
    inputType: "text",
    description: "Optional: Specify map levels (comma-separated)",
  },
  // Output configuration
  {
    name: "fileFormat",
    label: "File Format",
    placeholder: "Select output format",
    optional: false,
    inputType: "select",
    options: enumToOptions(FormatEnum, labelCasingEnum.upperCase),
    description: "Format for output files",
  },
  {
    name: "outDir",
    label: "Output Directory",
    placeholder: "/path/to/output",
    optional: false,
    inputType: "text",
    description: "Directory to save output files",
  },
  // Processing options (boolean flags)
  {
    name: "tracking",
    label: "Enable Tracking",
    optional: false,
    inputType: "checkbox",
    description: "Track processing progress",
  },
  {
    name: "debug",
    label: "Debug Mode",
    optional: false,
    inputType: "checkbox",
    description: "Enable detailed logging",
  },
  {
    name: "noCompile",
    label: "Skip Compilation",
    optional: false,
    inputType: "checkbox",
    description: "Skip compilation step",
  },
  {
    name: "noExecute",
    label: "Skip Execution",
    optional: false,
    inputType: "checkbox",
    description: "Skip execution step",
  },
  {
    name: "noMaps",
    label: "Skip Map Generation",
    optional: false,
    inputType: "checkbox",
    description: "Skip map generation step",
  },
  {
    name: "animation",
    label: "Generate Animation",
    optional: false,
    inputType: "checkbox",
    description: "Create animated outputs",
  },
  // Parallel processing options
  {
    name: "omp",
    label: "Use OpenMP",
    optional: false,
    inputType: "checkbox",
    description: "Enable OpenMP parallelization",
  },
  {
    name: "mpi",
    label: "Use MPI",
    optional: false,
    inputType: "checkbox",
    description: "Enable MPI parallelization",
  },
  {
    name: "nThreads",
    label: "Number of Threads",
    placeholder: "e.g., 4",
    optional: true,
    inputType: "number",
    description: "Number of threads for OpenMP",
  },
  {
    name: "nProces",
    label: "Number of Processes",
    placeholder: "e.g., 2",
    optional: true,
    inputType: "number",
    description: "Number of processes for MPI",
  },
];
