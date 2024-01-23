import * as React from "react";
import {
  InstillStore,
  useEntity,
  useInstillStore,
  useShallow,
  useUser,
  useUserMe,
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

export const UserProfile = () => {
  const router = useRouter();
  const entityObject = useEntity();

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const me = useUserMe({
    enabled: enabledQuery,
    accessToken,
  });

  const user = useUser({
    userName: entityObject.entityName,
    accessToken: accessToken,
    enabled: enabledQuery && entityObject.isSuccess,
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
            name={`${user.data.first_name} ${user.data.last_name}`}
            bio={user.data.profile_data?.bio}
            avatar={user.data.profile_avatar ?? null}
            userMemberships={null}
            isOwner={
              me.isSuccess &&
              entityObject.isSuccess &&
              me.data.id === String(entityObject.entity)
            }
            twitterLink={user.data.profile_data?.twitter ?? null}
            githubLink={user.data.profile_data?.github ?? null}
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
