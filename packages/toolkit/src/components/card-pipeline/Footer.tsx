import * as React from "react";
import {
  Button,
  Icons,
  Separator,
  Tag,
  useToast,
} from "@instill-ai/design-system";
import { useRouter } from "next/router";
import {
  CreateUserPipelinePayload,
  InstillStore,
  Pipeline,
  generateRandomReadableName,
  toastInstillError,
  useCreateUserPipeline,
  useInstillStore,
  useShallow,
  useUserMe,
} from "../../lib";
import {
  getRawPipelineRecipeFromPipelineRecipe,
  sortPipelineReleases,
} from "../../view";
import { LoadingSpin } from "../LoadingSpin";

export const FooterSkeleton = () => {
  return (
    <div className="flex flex-col px-6 pb-4">
      <div className="flex flex-row">
        <div className="h-5 w-20 shrink-0 grow-0 animate-pulse rounded bg-semantic-bg-secondary"></div>
      </div>
      <Separator orientation="horizontal" className="my-2" />
      <div className="flex flex-row-reverse">
        <div className="h-10 w-[100px] shrink-0 grow-0 animate-pulse rounded bg-semantic-bg-secondary"></div>
      </div>
    </div>
  );
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const Footer = ({
  isOwner,
  ownerID,
  pipeline,
}: {
  isOwner: boolean;
  ownerID: string;
  pipeline: Pipeline;
}) => {
  const router = useRouter();
  const [isCloning, setIsCloning] = React.useState(false);

  const { toast } = useToast();
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const me = useUserMe({
    enabled: enabledQuery,
    accessToken,
  });

  const createPipeline = useCreateUserPipeline();
  async function handleClonePipeline() {
    if (!me.isSuccess || !accessToken) {
      return;
    }

    setIsCloning(true);

    const payload: CreateUserPipelinePayload = {
      id: generateRandomReadableName(),
      recipe: getRawPipelineRecipeFromPipelineRecipe(pipeline.recipe),
      metadata: pipeline.metadata,
    };

    try {
      await createPipeline.mutateAsync({
        payload,
        accessToken,
        entityName: me.data.name,
      });

      setIsCloning(false);

      await router.push(`/${me.data.id}/pipelines/${payload.id}`);

      router.reload();

      toast({
        title: "Successfully cloned the pipeline",
        variant: "alert-success",
        size: "small",
      });
    } catch (error) {
      setIsCloning(false);
      toastInstillError({
        title:
          "Something went wrong when clone the pipeline, please try again later",
        error,
        toast,
      });
    }
  }

  const latestRelease = React.useMemo(() => {
    if (pipeline.releases.length === 0) {
      return null;
    }
    return sortPipelineReleases(pipeline.releases)[0].id;
  }, [pipeline]);

  console.log(latestRelease);

  return (
    <div className="flex flex-col px-6 pb-4">
      <div className="flex flex-row">
        {latestRelease ? (
          <Tag variant="darkBlue" size="sm">
            {latestRelease}
          </Tag>
        ) : null}
      </div>
      <Separator orientation="horizontal" className="my-2" />
      <div className="flex flex-row-reverse">
        {isOwner ? (
          <Button
            className="flex flex-row gap-x-2"
            variant="tertiaryGrey"
            size="lg"
            onClick={() => {
              router.push(`/${ownerID}/pipelines/${pipeline.id}/builder`);
            }}
          >
            <Icons.Edit03 className="h-4 w-4 stroke-semantic-fg-secondary" />
            Edit
          </Button>
        ) : (
          <Button
            className="flex flex-row gap-x-2"
            variant="tertiaryGrey"
            size="lg"
            onClick={async () => {
              await handleClonePipeline();
            }}
          >
            {isCloning ? (
              <LoadingSpin className="!text-semantic-fg-primary" />
            ) : (
              <Icons.Copy07 className="h-3 w-3 stroke-semantic-accent-default" />
            )}
            Clone
          </Button>
        )}
      </div>
    </div>
  );
};
Footer.Skeleton = FooterSkeleton;
