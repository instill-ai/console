import { useMutation } from "@tanstack/react-query";
import { Nullable } from "../../type";
import {
  type TriggerUserModelPayload,
  triggerUserModelActionAsync,
} from "../../vdp-sdk";

export function useTriggerUserModelAsync() {
  return useMutation({
    mutationFn: async ({
      modelName,
      payload,
      accessToken,
    }: {
      modelName: string;
      payload: TriggerUserModelPayload;
      accessToken: Nullable<string>;
    }) => {
      const response = await triggerUserModelActionAsync({
        modelName,
        payload,
        accessToken,
      });

      return Promise.resolve(response);
    },
  });
}
