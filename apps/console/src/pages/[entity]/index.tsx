import * as React from "react";
import {
  PageBase,
  BreadcrumbWithLink,
  useUser,
  usePipelines,
  PipelinesTable,
  Profile,
  useEntity,
} from "@instill-ai/toolkit";
import { Logo } from "@instill-ai/design-system";
import { useRouter } from "next/router";

import { NextPageWithLayout } from "../_app";
import { ConsoleCorePageHead, Topbar } from "components";
import { useAccessToken } from "lib/useAccessToken";

const ProfilePage: NextPageWithLayout = () => {
  const router = useRouter();
  const { entity } = router.query;

  const accessToken = useAccessToken();

  const entityObject = useEntity();

  const user = useUser({
    userName: entityObject.entityName,
    accessToken: accessToken.isSuccess ? accessToken.data : null,
    enabled: accessToken.isSuccess && entityObject.isSuccess,
  });

  const pipelines = usePipelines({
    accessToken: accessToken.isSuccess ? accessToken.data : null,
    enabled: accessToken.isSuccess,
  });

  React.useEffect(() => {
    if (user.isError) {
      router.push("/404");
    }
  }, [user.isError]);

  return (
    <React.Fragment>
      <ConsoleCorePageHead title="Settings" />
      <div className="mb-[52px] w-full px-20">
        <BreadcrumbWithLink
          items={[{ label: "Home", link: "/" }, { label: "Profile" }]}
        />
      </div>
      <Profile.Root>
        {user.isSuccess ? (
          <Profile.Bio
            id={user.data.id}
            name={user.data.org_name}
            bio={user.data.profile_data?.bio}
            avatar={user.data.profile_avatar ?? null}
            userMemberships={null}
            isOwner={user.data.id === String(entity)}
            twitterLink={user.data.profile_data?.twitter ?? null}
            githubLink={user.data.profile_data?.github ?? null}
          />
        ) : null}
        <div className="flex w-full flex-col gap-y-8 px-8">
          <Profile.Separator title="Pipelines" />
          {pipelines.data?.length ? (
            <PipelinesTable
              pipelines={pipelines.data ? pipelines.data : []}
              isError={pipelines.isError}
              isLoading={pipelines.isLoading}
            />
          ) : (
            <p className="text-semantic-fg-disabled product-headings-heading-5">
              No pipelines created yet
            </p>
          )}
        </div>
      </Profile.Root>
    </React.Fragment>
  );
};

ProfilePage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar logo={<Logo variant="colourLogomark" width={38} />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="!px-0 !py-8">{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default ProfilePage;
