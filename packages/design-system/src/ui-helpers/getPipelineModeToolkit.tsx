import cn from "clsx";
import { IconStyle, PipelineMode } from "../types/general";
import { AsyncIcon, SyncIcon } from "../ui";

export const getPipelineModeToolkit = (mode: PipelineMode) => {
  switch (mode) {
    case "MODE_ASYNC":
      return {
        getIcon: (iconStyle: IconStyle) => <AsyncIcon {...iconStyle} />,
        label: "Async",
      };
    case "MODE_SYNC":
      return {
        getIcon: (iconStyle: IconStyle) => <SyncIcon {...iconStyle} />,
        label: "Sync",
      };
    default:
      return {
        getIcon: (iconStyle: IconStyle) => {
          return <div className={cn(iconStyle.width, iconStyle.height)} />;
        },
        label: "",
      };
  }
};
