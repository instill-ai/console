import * as React from "react";
import { useRouter } from "next/router";
import {
  ConnectorWithDefinition,
  CreateUserPipelinePayload,
  InstillStore,
  Model,
  Pipeline,
  toastInstillError,
  useCreateUserPipeline,
  useDeleteUserPipeline,
  useInstillStore,
  useOrganization,
  useShallow,
  useUser,
  useUserMe,
} from "../../lib";
import { ImageWithFallback } from "../ImageWithFallback";
import { Icons, useToast } from "@instill-ai/design-system";
import { getRawPipelineRecipeFromPipelineRecipe } from "../../view";
import { Menu } from "./Menu";
import { Nullable } from "vitest";
import { EntityAvatar } from "../EntityAvatar";

export const HeadSkeleton = () => {
  return (
    <div className="flex w-full flex-row gap-x-2 p-3">
      <div className="my-auto h-8 w-8 shrink-0 grow-0 animate-pulse rounded-full bg-semantic-bg-secondary" />
      <div className="h-[38px] w-20 animate-pulse rounded bg-semantic-bg-secondary"></div>
    </div>
  );
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const Head = ({
  ownerID,
  isOrg,
  isOwner,
  pipeline,
}: {
  ownerID: string;
  isOrg: boolean;
  isOwner: boolean;
  pipeline: Pipeline;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const user = useUser({
    userName: `users/${ownerID}`,
    accessToken,
    enabled: enabledQuery && !isOrg,
  });

  const organization = useOrganization({
    organizationID: ownerID,
    accessToken,
    enabled: enabledQuery && isOrg,
  });

  const imageSrc = React.useMemo(() => {
    if (isOrg && organization.isSuccess) {
      return organization.data.profile_avatar ?? null;
    }

    if (!isOrg && user.isSuccess) {
      return user.data.profile_avatar ?? null;
    }

    return null;
  }, [
    isOrg,
    user.data,
    user.isSuccess,
    organization.data,
    organization.isSuccess,
  ]);

  const me = useUserMe({
    enabled: enabledQuery,
    accessToken,
  });

  const createPipeline = useCreateUserPipeline();
  async function handleDuplicatePipeline() {
    if (!me.isSuccess || !accessToken) return;

    const payload: CreateUserPipelinePayload = {
      id: `copy-of-${pipeline.id}`,
      description: pipeline.description,
      recipe: getRawPipelineRecipeFromPipelineRecipe(pipeline.recipe),
      metadata: pipeline.metadata,
    };

    try {
      await createPipeline.mutateAsync({
        entityName: me.data.name,
        payload,
        accessToken,
      });

      toast({
        title: "Successfully duplicate the pipeline",
        variant: "alert-success",
        size: "small",
      });
    } catch (error) {
      toastInstillError({
        title:
          "Something went wrong when save the pipeline, please try again later.",
        error,
        toast,
      });
    }
  }

  const deletePipeline = useDeleteUserPipeline();
  function handleDeletePipeline(
    resource: Nullable<Pipeline | Model | ConnectorWithDefinition>
  ): void {
    if (!resource) return;

    try {
      deletePipeline.mutateAsync({
        pipelineName: resource.name,
        accessToken: accessToken ? accessToken : null,
      });

      toast({
        title: "Pipeline deleted",
        variant: "alert-success",
        size: "large",
      });
    } catch (error) {
      toastInstillError({
        title: "Something went wrong when delete the pipeline",
        error,
        toast,
      });
    }
  }

  return (
    <div className="flex flex-row p-3">
      <div className="mr-auto flex flex-row gap-x-2">
        <EntityAvatar
          src={imageSrc ?? null}
          className="h-8 w-8"
          entityName={ownerID}
          fallbackImg={
            <div className="my-auto flex h-8 w-8 shrink-0 grow-0 rounded-full bg-semantic-bg-line">
              <Icons.User02 className="m-auto h-4 w-4 stroke-semantic-fg-disabled" />
            </div>
          }
        />
        <button
          type="button"
          className="my-auto !normal-case text-semantic-accent-default product-button-button-2 hover:!underline"
          onClick={() => {
            router.push(`/${ownerID}`);
          }}
        >
          {ownerID}
        </button>
      </div>
      {isOwner ? (
        <Menu
          pipeline={pipeline}
          handleDuplicatePipeline={handleDuplicatePipeline}
          handleDeletePipeline={handleDeletePipeline}
        />
      ) : null}
    </div>
  );
};
Head.Skeleton = HeadSkeleton;
