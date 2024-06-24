export const getModelRegionToolkit = (regionName: string) => {
  switch (regionName) {
    case "REGION_GCP_EUROPE_WEST4":
      return "GCP europe-west4";
    case "REGION_LOCAL":
      return "Local";
    default:
      return null;
  }
};
