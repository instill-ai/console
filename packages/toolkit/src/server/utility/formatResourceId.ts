export const formatResourceId = (name?: string, prefix?: string) => {
  if (!name) {
    return name;
  }

  // First, lowercase the name and replace invalid characters with hyphens
  let formatted = name.toLowerCase().replace(/[^a-z0-9-]/g, "-");

  // Remove leading hyphens
  formatted = formatted.replace(/^-+/, "");

  // Ensure it starts with a letter
  if (!/^[a-z]/.test(formatted)) {
    formatted = (prefix || "i") + formatted;
  }

  // Remove consecutive hyphens
  formatted = formatted.replace(/-+/g, "-");

  // Truncate to 32 characters
  formatted = formatted.slice(0, 32);

  // Remove trailing hyphens
  formatted = formatted.replace(/-+$/, "");

  return formatted;
};
