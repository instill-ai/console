import * as React from "react";
import { CheckIsHidden } from "../../../lib";

export function useCheckIsHiddenOnNode() {
  // We need to put this function into a useCallback to prevent infinite loop
  const checkIsHidden: CheckIsHidden = React.useCallback(
    ({ parentSchema, targetKey }) => {
      if (!parentSchema) {
        return false;
      }

      if (!parentSchema.instillEditOnNodeFields) {
        return false;
      }

      if (!targetKey) {
        return false;
      }

      if (parentSchema.instillEditOnNodeFields.includes(targetKey)) {
        return false;
      }

      return true;
    },
    []
  );

  return checkIsHidden;
}
