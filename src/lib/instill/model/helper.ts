import { Nullable } from "@/types/general";
import { ProgressMessageBoxState } from "@instill-ai/design-system";
import { Dispatch, SetStateAction } from "react";
import { getModelOperationQuery, getModelQuery } from "./queries";
import { Model } from "./types";
import {
  AmplitudeEvent,
  AmplitudeEventProperties,
  sendAmplitudeData,
} from "@/lib/amplitude";

export const checkCreateModelOperationUntilDone = async (
  operationName: string,
  modelName: string,
  setModelCreated: Dispatch<SetStateAction<boolean>>,
  setNewModel: Dispatch<SetStateAction<Nullable<Model>>>,
  setCreateModelMessageBoxState: Dispatch<
    SetStateAction<ProgressMessageBoxState>
  >,
  amplitudeIsInit: boolean
) => {
  try {
    const operation = await getModelOperationQuery(operationName);
    if (operation.done) {
      const model = await getModelQuery(modelName);
      setModelCreated(true);
      setNewModel(model);
      setCreateModelMessageBoxState({
        activate: true,
        status: "success",
        description: null,
        message: "Succeed.",
      });

      if (amplitudeIsInit) {
        sendAmplitudeData("create_github_model", {
          type: "critical_action",
          process: "model",
        });
      }

      return Promise.resolve(true);
    } else {
      setTimeout(
        () =>
          checkCreateModelOperationUntilDone(
            operationName,
            modelName,
            setModelCreated,
            setNewModel,
            setCreateModelMessageBoxState,
            amplitudeIsInit
          ),
        1500
      );
    }
  } catch (err) {
    return Promise.reject(err);
  }
};
