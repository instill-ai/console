import * as React from "react";
import { Button, Separator, Tag } from "@instill-ai/design-system";
import {
  InstillStore,
  Nullable,
  useInstillStore,
  useShallow,
  useUserMe,
} from "../lib";
import { useRouter } from "next/router";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export type UserProfileCardProps = {
  totalPipelines: Nullable<number>;
  visitorCta?: {
    title: string;
    onClick: () => void;
  };
};

export const UserProfileCard = ({
  totalPipelines,
  visitorCta,
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
            <div className="mx-auto h-20 w-20 shrink-0 grow-0 rounded-full bg-semantic-bg-line"></div>
            {!me.data?.first_name || !me.data?.last_name ? (
              <h3 className="mx-auto text-semantic-fg-primary product-headings-heading-3">
                {me.data?.id}
              </h3>
            ) : (
              <div className="mx-auto flex flex-col gap-y-1">
                <h3 className="text-semantic-fg-primary product-headings-heading-3">
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
          <div className="flex flex-col gap-y-2">
            <div className="flex flex-row gap-x-2">
              <p className="text-semantic-fg-primary product-body-text-2-semibold">
                My active pipelines
              </p>
              {totalPipelines ? (
                <p className="text-semantic-accent-default product-body-text-2-semibold">
                  {totalPipelines}
                </p>
              ) : null}
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
