"use client";

import * as React from "react";
import {
  InstillStore,
  Nullable,
  OrganizationOwner,
  Pipeline,
  UserOwner,
  toastInstillError,
  useDeleteUserPipeline,
  useInstillStore,
  useShallow,
} from "../../lib";
import { useToast } from "@instill-ai/design-system";
import { Menu } from "./Menu";
import { useRouter } from "next/navigation";
import { NamespaceAvatarWithFallback } from "../NamespaceAvatarWithFallback";

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
  isOwner,
  pipeline,
  ownerDisplayName,
}: {
  ownerID: string;
  isOwner: boolean;
  pipeline: Pipeline;
  ownerDisplayName: Nullable<string>;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const { accessToken } = useInstillStore(useShallow(selector));

  const deletePipeline = useDeleteUserPipeline();
  async function handleDeletePipeline() {
    try {
      await deletePipeline.mutateAsync({
        pipelineName: pipeline.name,
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

  const pipelineAvatar = React.useMemo(() => {
    if (pipeline.ownerName.split("/")[0] === "users") {
      return (pipeline.owner as UserOwner).user.profile?.avatar ?? null;
    }

    if (pipeline.ownerName.split("/")[0] === "organizations") {
      return (
        (pipeline.owner as OrganizationOwner).organization.profile?.avatar ??
        null
      );
    }

    return null;
  }, [pipeline]);

  return (
    <div className="flex flex-row p-3">
      <div className="mr-auto flex flex-row gap-x-2">
        <NamespaceAvatarWithFallback.Root
          src={pipelineAvatar}
          className="h-8 w-8"
          fallback={
            <NamespaceAvatarWithFallback.Fallback
              namespaceId={ownerID}
              displayName={ownerDisplayName}
              className="h-8 w-8"
            />
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
        <Menu pipeline={pipeline} handleDeletePipeline={handleDeletePipeline} />
      ) : null}
    </div>
  );
};
Head.Skeleton = HeadSkeleton;
