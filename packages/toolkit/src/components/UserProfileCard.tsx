import * as React from "react";
import { Button, Icons, Separator, Tag } from "@instill-ai/design-system";
import {
  InstillStore,
  Nullable,
  UserMembership,
  useInstillStore,
  useShallow,
  useUserMe,
} from "../lib";
import { useRouter } from "next/router";
import { EntityAvatar } from "./EntityAvatar";

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
  organizations?: UserMembership[];
};

export const UserProfileCard = ({
  totalPipelines,
  totalPublicPipelines,
  visitorCta,
  organizations,
}: UserProfileCardProps) => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const router = useRouter();

  const me = useUserMe({
    enabled: enabledQuery,
    accessToken,
  });

  return (
    <div className="flex flex-col rounded-sm border border-semantic-bg-line p-3">
      {me.isSuccess ? (
        <React.Fragment>
          <div className="flex flex-col gap-y-4">
            <EntityAvatar
              src={me.data.profile_avatar ?? null}
              className="mx-auto h-20 w-20"
              entityName={me.data.name}
              fallbackImg={
                <div className="mx-auto flex h-20 w-20 shrink-0 grow-0 rounded-full bg-semantic-bg-line">
                  <Icons.User02 className="m-auto h-10 w-10 stroke-semantic-fg-disabled" />
                </div>
              }
            />

            {!me.data?.first_name || !me.data?.last_name ? (
              <h3 className="mx-auto text-center text-semantic-fg-primary product-headings-heading-3">
                {me.data?.id}
              </h3>
            ) : (
              <div className="mx-auto flex flex-col gap-y-1">
                <h3 className="mx-auto text-semantic-fg-primary product-headings-heading-3">
                  {`${me.data.first_name} ${me.data.last_name}`}
                </h3>
                <Tag className="mx-auto" variant="default" size="sm">
                  {me.data.id}
                </Tag>
              </div>
            )}
            <p className="py-2 text-center text-semantic-fg-primary product-body-text-3-regular">
              {me.data?.profile_data?.bio}
            </p>
          </div>
          <Separator orientation="horizontal" className="my-4" />
          {organizations ? (
            <React.Fragment>
              <div className="flex flex-col gap-y-2">
                <p className="text-semantic-fg-primary product-body-text-2-semibold">
                  Organizations
                </p>
                {organizations.map((org) => (
                  <button
                    key={org.organization.id}
                    onClick={() => {
                      router.push(`/${org.organization.id}`);
                    }}
                    className="flex !normal-case text-semantic-accent-default product-button-button-2 hover:!underline"
                  >
                    {org.organization.id}
                  </button>
                ))}
              </div>
              <Separator orientation="horizontal" className="my-4" />
            </React.Fragment>
          ) : null}
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
            {totalPublicPipelines || totalPublicPipelines === 0 ? (
              <div className="flex flex-row gap-x-2">
                <p className="text-semantic-fg-primary product-body-text-2-semibold">
                  My active public pipelines
                </p>
                <p className="text-semantic-accent-default product-body-text-2-semibold">
                  {totalPublicPipelines}
                </p>
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
