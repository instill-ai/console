"use client";

import * as React from "react";
import { OrganizationOwner, Pipeline, UserOwner } from "../../../../lib";
import { Icons, Tag } from "@instill-ai/design-system";
import { EntityAvatar } from "../../../../components/EntityAvatar";
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

  // Function to transform the ID into a more readable format
  const transformID = (id: string) => {
    return id
      .split(/[-_]/) // Split the ID by dash and underscore
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1)) // Capitalize each part
      .join(" "); // Join the parts with a space
  };

  const displayName = React.useMemo(() => {
    const owner = pipeline.owner;

    if ("user" in owner) {
      const userOwner = owner as UserOwner;
      const userID = userOwner.user.name.split("/")[1]; // Get the part after "/"

      if (userOwner.user.profile?.display_name?.trim()) {
        return userOwner.user.profile.display_name;
      } else {
        // Transform userID if display_name is empty, null, or consists of only whitespace
        return transformID(userID);
      }
    } else if ("organization" in owner) {
      const orgOwner = owner as OrganizationOwner;
      const orgID = orgOwner.organization.id;

      if (orgOwner.organization.profile?.display_name?.trim()) {
        return orgOwner.organization.profile.display_name;
      } else {
        // Transform orgID if display_name is empty, null, or consists of only whitespace
        return transformID(orgID);
      }
    }
  }, [pipeline.owner]);

  return (
    <div className="flex flex-row p-3">
      <div className="mr-auto flex flex-row gap-x-2">
        <EntityAvatar
          src={pipelineAvatar}
          className="my-auto h-8 w-8"
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
            {displayName}
          </button>
          <div>
            <Tag
              variant={"default"}
              className="bg-semantic-bg-base-bg"
              style={{ paddingTop: 0.5, paddingBottom: 0.5 }}
            >
              {ownerID}
            </Tag>
          </div>
        </div>
      </div>
    </div>
  );
};

Head.Skeleton = HeadSkeleton;
