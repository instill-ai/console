export const getModelRegionToolkit = (regionName: string) => {
  switch (regionName) {
    case "REGION_GCP_EUROPE_WEST4":
      return "GCP Europe-West4";
    case "REGION_LOCAL":
      return "Local";
    default:
      return "Unknown";
  }
};
