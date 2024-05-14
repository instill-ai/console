"use client";

import * as React from "react";
import {
  InstillStore,
  OrganizationOwner,
  Pipeline,
  UserOwner,
  toastInstillError,
  useDeleteUserPipeline,
  useInstillStore,
  useShallow,
} from "../../lib";
import { Icons, useToast } from "@instill-ai/design-system";
import { EntityAvatar } from "../EntityAvatar";
import { useRouter } from "next/navigation";

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
}: {
  ownerID: string;
  isOwner: boolean;
  pipeline: Pipeline;
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
    if (pipeline.owner_name.split("/")[0] === "users") {
      return (pipeline.owner as UserOwner).user.profile?.avatar ?? null;
    }

    if (pipeline.owner_name.split("/")[0] === "organizations") {
      return (
        (pipeline.owner as OrganizationOwner).organization.profile?.avatar ??
        null
      );
    }

    return null;
  }, [pipeline]);

  const displayName = React.useMemo(() => {
    const owner = pipeline.owner as UserOwner;
    const username = owner?.user?.name?.split("/")[1]; // Get the part after "users/"
    const ownerName =
      owner?.user?.profile?.company_name ||
      owner?.user?.profile?.display_name ||
      "";

    // If username exists, use it directly
    if (username) {
      return username;
    } else {
      // If ownerName contains spaces, return it in lowercase with hyphens
      if (ownerName.includes(" ")) {
        return ownerName.toLowerCase().replace(/\s+/g, "-");
      } else {
        // If the owner name doesn't contain spaces, return it in lowercase
        return ownerName.toLowerCase();
      }
    }
  }, [pipeline.owner]);

  return (
    <div className="flex flex-row p-3">
      <div className="mr-auto flex flex-row gap-x-2">
        <EntityAvatar
          src={pipelineAvatar}
          className="h-8 w-8"
          entityName={ownerID}
          fallbackImg={
            <div className="my-auto flex h-8 w-8 shrink-0 grow-0 rounded-full bg-semantic-bg-line">
              <Icons.User02 className="m-auto h-4 w-4 stroke-semantic-fg-disabled" />
            </div>
          }
        />
        <div className="flex-col">
          <button
            type="button"
            className="my-auto !normal-case text-semantic-accent-default product-button-button-2 hover:!underline"
            onClick={() => {
              router.push(`/${ownerID}`);
            }}
          >
            {ownerID}
          </button>
          <div className="rounded-m bg-neutral-0 rounded-full border border-neutral-200 p-1 text-center text-sm font-bold text-neutral-600">
            {displayName}
          </div>
        </div>
      </div>
    </div>
  );
};

Head.Skeleton = HeadSkeleton;
