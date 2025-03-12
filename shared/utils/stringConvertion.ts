// Helper function to convert comma-separated string to number array
export const stringToNumberArray = (value: unknown) => {
  return typeof value === "string"
    ? value
        .split(",")
        .map((s) => Number(s.trim()))
        .filter((n) => !isNaN(n))
    : [];
};

// Helper function to convert comma-separated string to string array
export const stringToStringArray = (value: unknown) => {
  return typeof value === "string"
    ? value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : value;
};
