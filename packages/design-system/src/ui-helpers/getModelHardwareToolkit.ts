export const getModelHardwareToolkit = (hardwareName: string) => {
  switch (hardwareName) {
    case "CPU":
      return "CPU";
    case "GPU":
      return "GPU";
    case "NVIDIA_TESLA_T4":
      return "Nvidia Tesla T4";
    case "NVIDIA_L4":
      return "Nvidia L4";
    case "NVIDIA_A100":
      return "Nvidia A100 (in shortage)";
    case "Custom":
      return "Custom";
    default:
      return "Unknown";
  }
};
