import * as React from "react";
import { CheckIsHidden } from "../../../../lib";

export function useCheckIsHidden(type: "onNode" | "onRightPanel") {
  const checkIsHidden: CheckIsHidden = React.useCallback(
    ({ parentSchema, targetPath, targetKey }) => {
      let isHidden = false;

      if (!targetKey || !targetPath) {
        isHidden = true;
      }

      // We don't want to showcase task selection on the right-panel
      if (targetPath && targetPath === "task") {
        isHidden = true;
      }

      if (
        targetKey &&
        parentSchema &&
        parentSchema.instillEditOnNodeFields &&
        parentSchema.instillEditOnNodeFields.includes(targetKey)
      ) {
        isHidden = true;
      }

      if (type === "onNode") {
        return !isHidden;
      } else {
        return isHidden;
      }
    },
    [type]
  );

  return checkIsHidden;
}
