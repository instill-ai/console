import { useMutation } from "@tanstack/react-query";
import { Nullable } from "../../type";
import {
  type TriggerUserPipelinePayload,
  triggerUserPipelineAction,
} from "../../vdp-sdk";
import { useRouter } from "next/router";

export const useTriggerUserPipeline = () => {
  const router = useRouter();

  return useMutation(
    async ({
      pipelineName,
      payload,
      accessToken,
      returnTraces,
    }: {
      pipelineName: string;
      payload: TriggerUserPipelinePayload;
      accessToken: Nullable<string>;
      returnTraces?: boolean;
    }) => {
      const response = await triggerUserPipelineAction({
        pipelineName,
        payload,
        accessToken,
        returnTraces,
        shareCode: router.query.view?.toString() ?? undefined,
      });

      return Promise.resolve(response);
    }
  );
};
