"use client";

import * as React from "react";
import { Button, Icons, Separator, Tag } from "@instill-ai/design-system";
import {
  InstillStore,
  Nullable,
  useInstillStore,
  useShallow,
  useAuthenticatedUser,
  useUserMemberships,
} from "../lib";
import { EntityAvatar } from "./EntityAvatar";
import Link from "next/link";
import { useRouter } from "next/navigation";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export type UserProfileCardProps = {
  totalPipelines: Nullable<number>;
  totalPublicPipelines: Nullable<number>;
  visitorCta?: {
    title: string;
    onClick: () => void;
  };
};

export const UserProfileCard = ({
  totalPipelines,
  totalPublicPipelines,
  visitorCta,
}: UserProfileCardProps) => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const router = useRouter();

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  const memberships = useUserMemberships({
    enabled: enabledQuery && me.isSuccess,
    userID: me.isSuccess ? me.data.id : null,
    accessToken,
  });

  return (
    <div className="flex flex-col rounded-sm border border-semantic-bg-line p-3">
      {me.isSuccess ? (
        <React.Fragment>
          <div className="flex flex-col gap-y-4">
            <EntityAvatar
              src={me.data.profile?.avatar ?? null}
              className="mx-auto h-20 w-20"
              entityName={me.data.name}
              fallbackImg={
                <div className="mx-auto flex h-20 w-20 shrink-0 grow-0 rounded-full bg-semantic-bg-line">
                  <Icons.User02 className="m-auto h-10 w-10 stroke-semantic-fg-disabled" />
                </div>
              }
            />

            {!me.data.profile?.display_name ? (
              <h3 className="mx-auto text-center text-semantic-fg-primary product-headings-heading-3">
                {me.data?.id}
              </h3>
            ) : (
              <div className="mx-auto flex flex-col gap-y-1">
                <h3 className="mx-auto text-semantic-fg-primary product-headings-heading-3">
                  {me.data.profile?.display_name}
                </h3>
                <Tag className="mx-auto" variant="default" size="sm" >
                  {me.data.id}
                </Tag>
              </div>
            )}
            {me.data.profile?.bio ? (
              <p className="py-2 text-left text-semantic-fg-primary product-body-text-3-regular">
                {me.data.profile.bio}
              </p>
            ) : null}
          </div>
          <Separator orientation="horizontal" className="my-4" />
          {memberships.isSuccess && memberships.data.length !== 0 ? (
            <React.Fragment>
              <div className="flex flex-col gap-y-2">
                <p className="text-semantic-fg-primary product-body-text-2-semibold">
                  Organizations
                </p>
                {memberships.data.map((membership) => (
                  <button
                    key={membership.organization.id}
                    onClick={() => {
                      router.push(`/${membership.organization.id}`);
                    }}
                    className="flex !normal-case text-semantic-accent-default product-button-button-2 hover:!underline"
                  >
                    {membership.organization.id}
                  </button>
                ))}
              </div>
              <Separator orientation="horizontal" className="my-4" />
            </React.Fragment>
          ) : null}
          <div className="flex flex-col gap-y-2">
            {totalPipelines ? (
              <div className="flex flex-row gap-x-2 justify-between">
                <div className="flex items-center space-x-1">
                  <Icons.AlertCircle className="w-4 h-4 stroke-black " />
                  <p className="text-semantic-fg-primary product-body-text-2-semibold">
                    Pipelines
                  </p>
                </div>
                <p className="text-semantic-accent-default product-body-text-2-semibold">
                  {totalPipelines}
                </p>
              </div>
            ) : null}
            {totalPublicPipelines || totalPublicPipelines === 0 ? (
              <div className="flex flex-row gap-x-2 justify-between">
                <div className="flex items-center space-x-1">
                  <Icons.AlertCircle className="w-4 h-4 stroke-black " />
                  <p className="text-semantic-fg-primary product-body-text-2-semibold">
                    Public pipelines
                  </p>
                </div>
                <Link
                  href={`/${me.data.id}/pipelines?visibility=VISIBILITY_PUBLIC`}
                >
                  <p className="text-semantic-accent-default product-body-text-2-semibold">
                    {totalPublicPipelines}
                  </p>
                </Link>
              </div>
            ) : null}
          </div>
        </React.Fragment>
      ) : visitorCta ? (
        <Button
          onClick={visitorCta.onClick}
          className="w-full"
          variant="secondaryColour"
          size="lg"
        >
          {visitorCta.title}
        </Button>
      ) : (
        <Button
          onClick={() => {
            router.push("https://www.instill.tech");
          }}
          className="w-full"
          variant="secondaryColour"
          size="lg"
        >
          Learn more
        </Button>
      )}
    </div>
  );
};
