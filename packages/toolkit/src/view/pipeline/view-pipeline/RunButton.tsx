import { useRouter, useSearchParams } from "next/navigation";
import {
  InstillStore,
  useAppEntity,
  useInstillStore,
  useShallow,
  useUserPipeline,
} from "../../../lib";
import { Button, Icons, Skeleton } from "@instill-ai/design-system";
import { LoadingSpin } from "../../../components";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const shareCode = searchParams.get("shareCode");

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const entity = useAppEntity();

  const pipeline = useUserPipeline({
    pipelineName: entity.isSuccess ? entity.data.pipelineName : null,
    enabled: enabledQuery && entity.isSuccess,
    shareCode: shareCode ?? undefined,
    accessToken,
  });

  if (!pipeline.isSuccess) {
    return <RunButtonSkeleton />;
  }

  if (inputIsNotDefined || outputIsNotDefined) {
    return <div className="h-[34px] shrink-0 grow-0" />;
  }

  if (enabledQuery && !accessToken) {
    <Button
      onClick={() => {
        router.push("/login");
      }}
      className="!h-8"
      type="button"
      variant="secondaryColour"
      size="md"
    >
      Log in to run
    </Button>;
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
