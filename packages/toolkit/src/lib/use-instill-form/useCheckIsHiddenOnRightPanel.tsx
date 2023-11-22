import * as React from "react";
import { CheckIsHidden } from "..";

export function useCheckIsHiddenOnRightPanel() {
  const checkIsHidden: CheckIsHidden = React.useCallback(
    ({ parentSchema, targetPath, targetKey }) => {
      if (!targetKey || !targetPath) {
        return true;
      }

      // We don't want to showcase task selection on the right-panel
      if (targetPath && targetPath === "task") {
        return true;
      }

      if (
        targetKey &&
        parentSchema &&
        parentSchema.instillEditOnNodeFields &&
        parentSchema.instillEditOnNodeFields.includes(targetKey)
      ) {
        return true;
      }

      return false;
    },
    []
  );

  return checkIsHidden;
}
