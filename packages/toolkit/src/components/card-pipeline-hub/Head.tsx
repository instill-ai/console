"use client";

import * as React from "react";
import { OrganizationOwner, Pipeline, UserOwner } from "../../lib";
import { Icons, Tag } from "@instill-ai/design-system";
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

export const Head = ({
  ownerID,
  pipeline,
}: {
  ownerID: string;
  pipeline: Pipeline;
}) => {
  const router = useRouter();

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
    const userID = owner?.user?.name?.split("/")[1]; // Get the part after "users/"
    const ownerDisplayName =
      owner?.user?.profile?.company_name ||
      owner?.user?.profile?.display_name ||
      "";

    if (userID) {
      return userID;
    } else {
      // If ownerName contains spaces, return it in lowercase with hyphens
      if (ownerDisplayName.includes(" ")) {
        return ownerDisplayName.toLowerCase().replace(/\s+/g, "-");
      } else {
        // If the owner name doesn't contain spaces, return it in lowercase
        return ownerDisplayName.toLowerCase();
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
          <div>
            <Tag
              variant={"default"}
              className="bg-semantic-bg-base-bg"
              style={{ paddingTop: 0.5, paddingBottom: 0.5 }}
            >
              {displayName}
            </Tag>
          </div>
        </div>
      </div>
    </div>
  );
};

Head.Skeleton = HeadSkeleton;
