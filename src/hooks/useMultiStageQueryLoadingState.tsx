import { useEffect, useState } from "react";

export type UseMultiStageQueryLoadingStatePayload = {
  data: any;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
};

export const useMultiStageQueryLoadingState = (
  payload: UseMultiStageQueryLoadingStatePayload
) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (payload.isError || payload.isSuccess) {
      setIsLoading(false);
      return;
    }

    if (payload.isLoading) {
      setIsLoading(true);
      return;
    }

    if (!payload.data) {
      setIsLoading(true);
      return;
    }
  }, [payload.isError, payload.isSuccess, payload.isLoading, payload.data]);

  return isLoading;
};
