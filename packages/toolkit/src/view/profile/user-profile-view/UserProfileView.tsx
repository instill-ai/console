"use client";

import * as React from "react";
import {
  InstillStore,
  useEntity,
  useInstillStore,
  useShallow,
  useUser,
  useAuthenticatedUser,
  useUserPipelines,
} from "../../../lib";
import { useRouter } from "next/router";
import { UserProfileBio } from "./Bio";
import { ProfileSeparator } from "../ProfileSeparator";
import { PipelinesTable } from "../../pipeline";
import { BreadcrumbWithLink } from "../../../components";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const UserProfileView = () => {
  const router = useRouter();
  const entityObject = useEntity();

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  const user = useUser({
    userName: entityObject.entityName,
    accessToken: accessToken,
    enabled:
      enabledQuery &&
      entityObject.isSuccess &&
      (entityObject.namespaceType === "NAMESPACE_ORGANIZATION" ||
        entityObject.namespaceType === "NAMESPACE_USER"),
  });

  const pipelines = useUserPipelines({
    accessToken: accessToken,
    enabled: enabledQuery && entityObject.isSuccess,
    userName: entityObject.isSuccess ? entityObject.entityName : null,
    filter: null,
    visibility: null,
  });

  React.useEffect(() => {
    if (user.isError) {
      router.push("/404");
    }
  }, [user.isError, router]);

  return (
    <React.Fragment>
      <div className="mb-[52px] w-full px-20">
        <BreadcrumbWithLink
          items={[{ label: "Home", link: "/" }, { label: "Profile" }]}
        />
      </div>
      <div className="flex w-full flex-row gap-x-6 pl-20 pr-28">
        {user.isSuccess ? (
          <UserProfileBio
            id={user.data.id}
            name={user.data?.profile?.display_name ?? user.data.id}
            bio={user.data.profile?.bio ?? null}
            avatar={user.data.profile?.avatar ?? null}
            userMemberships={null}
            isOwner={
              me.isSuccess &&
              entityObject.isSuccess &&
              me.data.id === String(entityObject.entity)
            }
            twitterLink={user.data.profile?.social_profiles_links?.x ?? null}
            githubLink={
              user.data.profile?.social_profiles_links?.github ?? null
            }
          />
        ) : (
          <UserProfileBio.Skeleton />
        )}
        <div className="flex w-full flex-col gap-y-8 px-8">
          <ProfileSeparator title="Pipelines" />
          <PipelinesTable
            pipelines={pipelines.data ? pipelines.data : []}
            isError={pipelines.isError}
            isLoading={pipelines.isLoading}
          />
        </div>
      </div>
    </React.Fragment>
  );
};
