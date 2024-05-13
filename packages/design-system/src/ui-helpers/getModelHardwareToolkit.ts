export const getModelHardwareToolkit = (hardwareName: string) => {
  switch (hardwareName) {
    case "CPU":
      return "CPU";
    case "NVIDIA_TESLA_T4":
      return "Nvidia Tesla T4";
    case "NVIDIA_L4":
      return "Nvidia L4";
    case "NVIDIA_A100":
      return "Nvidia A100";
  }
};
