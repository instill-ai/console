"use client";

import * as React from "react";
import {
  InstillStore,
  useInstillStore,
  useShallow,
  useUser,
  useAuthenticatedUser,
  useUserPipelines,
  useRouteInfo,
} from "../../../lib";
import { useRouter } from "next/navigation";
import { UserProfileBio } from "./Bio";
import { ProfileSeparator } from "../ProfileSeparator";
import { PipelinesTable } from "../../pipeline";
import { BreadcrumbWithLink } from "../../../components";
import { useUserModels } from "../../../lib/react-query-service/model/useUserModels";
import { ModelsTable } from "../../model";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const UserProfileView = () => {
  const router = useRouter();
  const routeInfo = useRouteInfo();

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  const user = useUser({
    userName: routeInfo.data.namespaceName,
    accessToken: accessToken,
    enabled:
      enabledQuery &&
      routeInfo.isSuccess &&
      (routeInfo.data.namespaceType === "NAMESPACE_ORGANIZATION" ||
        routeInfo.data.namespaceType === "NAMESPACE_USER"),
  });

  const pipelines = useUserPipelines({
    accessToken: accessToken,
    enabled: enabledQuery && routeInfo.isSuccess,
    userName: routeInfo.isSuccess ? routeInfo.data.namespaceName : null,
    filter: null,
    visibility: null,
  });

  const models = useUserModels({
    accessToken: accessToken,
    enabled: enabledQuery && routeInfo.isSuccess,
    userName: routeInfo.isSuccess ? routeInfo.data.namespaceName : null,
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
            name={user.data?.profile?.displayName ?? user.data.id}
            bio={user.data.profile?.bio ?? null}
            avatar={user.data.profile?.avatar ?? null}
            userMemberships={null}
            isOwner={
              me.isSuccess &&
              routeInfo.isSuccess &&
              me.data.id === String(routeInfo.data.namespaceId)
            }
            twitterLink={user.data.profile?.socialProfilesLinks?.x ?? null}
            githubLink={user.data.profile?.socialProfilesLinks?.github ?? null}
          />
        ) : (
          <UserProfileBio.Skeleton />
        )}
        <div className="flex flex-col gap-y-20">
          <div className="flex w-full flex-col gap-y-8 px-8">
            <ProfileSeparator title="Pipelines" />
            <PipelinesTable
              pipelines={pipelines.data ? pipelines.data : []}
              isError={pipelines.isError}
              isLoading={pipelines.isLoading}
            />
          </div>
          <div className="flex w-full flex-col gap-y-8 px-8">
            <ProfileSeparator title="Models" />
            <ModelsTable
              models={models.data ? models.data : []}
              isError={models.isError}
              isLoading={models.isLoading}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
