"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button, Separator, Tag } from "@instill-ai/design-system";

import {
  InstillStore,
  Nullable,
  useAuthenticatedUser,
  useInstillStore,
  useShallow,
} from "../lib";
import { NamespaceAvatarWithFallback } from "./NamespaceAvatarWithFallback";

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

// NOTE: Organization memberships display is EE-only (available in console-ee)
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

  return (
    <div className="flex flex-col rounded-sm border border-semantic-bg-line p-3">
      {me.isSuccess ? (
        <React.Fragment>
          <div className="flex flex-col gap-y-4">
            <NamespaceAvatarWithFallback.Root
              src={me.data.profile?.avatar ?? null}
              className="mx-auto h-20 w-20"
              fallback={
                <NamespaceAvatarWithFallback.Fallback
                  namespaceId={me.data.id}
                  displayName={me.data.profile?.displayName ?? null}
                  className="mx-auto h-20 w-20"
                  textClassName="!font-sans !text-[32px] !font-semibold"
                />
              }
            />

            {!me.data.profile?.displayName ? (
              <h3 className="mx-auto text-center text-semantic-fg-primary product-headings-heading-3">
                {me.data?.id}
              </h3>
            ) : (
              <div className="mx-auto flex flex-col gap-y-1">
                <h3 className="mx-auto text-semantic-fg-primary product-headings-heading-3">
                  {me.data.profile?.displayName}
                </h3>
                <Tag className="mx-auto" variant="default" size="sm">
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
          <div className="flex flex-col gap-y-2">
            {totalPipelines ? (
              <div className="flex flex-row gap-x-2">
                <p className="text-semantic-fg-primary product-body-text-2-semibold">
                  My active pipelines
                </p>
                <p className="text-semantic-accent-default product-body-text-2-semibold">
                  {totalPipelines}
                </p>
              </div>
            ) : null}
            <div className="flex flex-row gap-x-2">
              <p className="text-semantic-fg-primary product-body-text-2-semibold">
                My active public pipelines
              </p>
              <Link
                href={`/${me.data.id}/pipelines?visibility=VISIBILITY_PUBLIC`}
              >
                <p className="text-semantic-accent-default product-body-text-2-semibold">
                  {totalPublicPipelines ?? 0}
                </p>
              </Link>
            </div>
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
