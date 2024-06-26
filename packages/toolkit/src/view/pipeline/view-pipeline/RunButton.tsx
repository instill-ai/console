import { useSearchParams } from "next/navigation";

import { Button, Icons, Skeleton } from "@instill-ai/design-system";

import { LoadingSpin } from "../../../components";
import {
  InstillStore,
  useInstillStore,
  useNavigateBackAfterLogin,
  useRouteInfo,
  useShallow,
  useUserPipeline,
} from "../../../lib";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const RunButton = ({
  inputIsNotDefined,
  outputIsNotDefined,
  inOutPutFormID,
  isTriggeringPipeline,
}: {
  inputIsNotDefined: boolean;
  outputIsNotDefined: boolean;
  inOutPutFormID: string;
  isTriggeringPipeline: boolean;
}) => {
  const navigateBackAfterLogin = useNavigateBackAfterLogin();
  const searchParams = useSearchParams();
  const shareCode = searchParams.get("view");

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const routeInfo = useRouteInfo();

  const pipeline = useUserPipeline({
    pipelineName: routeInfo.isSuccess ? routeInfo.data.pipelineName : null,
    enabled: enabledQuery && routeInfo.isSuccess,
    shareCode: shareCode ?? undefined,
    accessToken,
  });

  if (!pipeline.isSuccess) {
    return <RunButtonSkeleton />;
  }

  if (inputIsNotDefined || outputIsNotDefined) {
    return <div className="h-[34px] shrink-0 grow-0" />;
  }

  if (!accessToken) {
    return (
      <Button
        onClick={() => {
          navigateBackAfterLogin();
        }}
        className="!h-8 !normal-case"
        type="button"
        variant="secondaryColour"
        size="md"
      >
        Log in to Run
      </Button>
    );
  }

  return (
    <Button
      variant="secondaryColour"
      size="md"
      className="flex !h-8 flex-row gap-x-2"
      type="submit"
      form={inOutPutFormID}
    >
      Run
      {isTriggeringPipeline ? (
        <LoadingSpin className="!h-4 !w-4 !text-semantic-accent-default" />
      ) : (
        <Icons.Play className="h-4 w-4 stroke-semantic-accent-default" />
      )}
    </Button>
  );
};

export const RunButtonSkeleton = () => {
  return <Skeleton className="w-18 h-8 rounded" />;
};

export const RunButtonPlaceholder = () => {
  return <div className="h-8 shrink-0 grow-0" />;
};
