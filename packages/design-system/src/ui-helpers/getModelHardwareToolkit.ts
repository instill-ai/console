export const getModelHardwareToolkit = (hardwareName: string) => {
  switch (hardwareName) {
    case "CPU":
      return "CPU";
    case "GPU":
      return "GPU";
    case "NVIDIA_TESLA_T4":
      return "NVIDIA Tesla T4";
    case "NVIDIA_L4":
      return "NVIDIA L4";
    case "NVIDIA_A100":
      return "NVIDIA A100";
    case "Custom":
      return "Custom";
    default:
      return null;
  }
};
