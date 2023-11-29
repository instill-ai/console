import React from "react";
import { ConsoleCorePageHead, Topbar } from "../../../components";
import { NextPageWithLayout } from "../../_app";
import { useAccessToken } from "../../../lib/useAccessToken";
import { useTrackToken } from "../../../lib/useTrackToken";
import {
  ModelsTable,
  PageBase,
  PipelinesTable,
  TeamMembersCard,
  useConnectorDefinitions,
  useModels,
  useOrganization,
  useUser,
  useUserPipelines,
  useWatchUserModels,
} from "@instill-ai/toolkit";
import {
  Button,
  GitHubIcon,
  Icons,
  Logo,
  Logos,
  Separator,
  Tag,
} from "@instill-ai/design-system";
import Link from "next/link";
import { useRouter } from "next/router";

const OrganizationPage: NextPageWithLayout = () => {
  const router = useRouter();
  const accessToken = useAccessToken();
  useTrackToken({ enabled: true });

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const organization = useOrganization({
    organizationName: router.query.id,
    enabled: accessToken.isSuccess,
    accessToken: accessToken.isSuccess ? accessToken.data : null,
    retry: false,
  });

  const user = useUser({
    enabled: accessToken.isSuccess,
    accessToken: accessToken.isSuccess ? accessToken.data : null,
    retry: false,
  });

  const pipelines = useUserPipelines({
    userName: user.data?.name ?? null,
    enabled: accessToken.isSuccess && user.isSuccess,
    accessToken: accessToken.isSuccess ? accessToken.data : null,
  });

  const models = useModels({
    enabled: accessToken.isSuccess,
    accessToken: accessToken.isSuccess ? accessToken.data : null,
  });
  const modelsWatchState = useWatchUserModels({
    modelNames: models.isSuccess ? models.data.map((p) => p.name) : [],
    enabled:
      accessToken.isSuccess && models.isSuccess && models.data.length > 0,
    accessToken: accessToken.isSuccess ? accessToken.data : null,
  });
  const isLoadingResource =
    models.isLoading || (models.isSuccess && models.data.length > 0)
      ? modelsWatchState.isLoading
      : false;

  if (organization.isLoading) {
    return <p className="p-3">Loading...</p>;
  }

  return (
    <React.Fragment>
      <ConsoleCorePageHead title="Open AI" />
      <div
        className="w-full h-[184px] flex gap-x-14 py-7 px-20 flex-row"
        style={{
          background: "linear-gradient(45deg, #DCE7FE 0%, #FEF1F2 100%)",
        }}
      >
        <div className="p-8 rounded-lg bg-white">
          <Logos.OpenAI className="h-16 w-16" />
        </div>
        <div className="flex items-end">
          <div className="space-y-4">
            <div className="flex flex-row gap-x-3">
              <p className="product-headings-heading-1">
                {organization.data.org_name}
              </p>
              <Tag size="sm" className="!my-1">
                Company
              </Tag>
            </div>
            <div className="flex flex-row gap-x-4">
              <div className="flex flex-row gap-x-2">
                <Icons.Globe01 className="h-3 w-3 stroke-slate-800 my-auto" />
                <p className="product-button-button-3 !lowercase my-auto">
                  www.openai.com
                </p>
              </div>
              <div className="flex flex-row gap-x-2">
                <Logos.TwitterDark className="h-3 w-3 stroke-slate-800 my-auto" />
                <p className="product-button-button-3 my-auto">Openai</p>
              </div>
              <div className="flex flex-row gap-x-2">
                <GitHubIcon
                  color="fill-instillGrey90"
                  height="h-[16px]"
                  position="my-auto"
                  width="w-[16px]"
                />
                <p className="my-auto product-button-button-3">Openai</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full px-28 py-14 flex flex-row gap-x-14">
        <div className="w-1/5 space-y-8">
          <div>
            <p className="product-body-text-2-semibold mb-2">Biography</p>
            <p className="product-body-text-3-regular">
              OpenAI researches artificial intelligence with the declared
              intention of developing safe and beneficial artificial general
              intelligence, which it defines as highly autonomous systems that
              outperform humans at most economically valuable work.
            </p>
          </div>
          <div>
            <div className="w-full flex flex-row gap-x-4">
              <p className="product-headings-heading-3">Team members</p>
              <Tag variant="lightBlue" className="!py-0">
                15
              </Tag>
            </div>
          </div>
          <div>
            <TeamMembersCard members={[]} />
          </div>
          <div>
            <Link href={`/organization/${router.query.id}/settings`}>
              <Button variant="secondaryGrey" size="md">
                Settings
              </Button>
            </Link>
          </div>
          <div></div>
        </div>

        <div className="w-4/5 space-y-8">
          <div className="relative w-full">
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-semantic-bg-base-bg px-2">
              <p className="product-body-text-3-medium text-semantic-fg-primary">
                Pipelines
              </p>
            </div>
            <Separator orientation="horizontal" />
          </div>

          <div>
            {pipelines.data?.length ? (
              <PipelinesTable
                pipelines={pipelines.data ? pipelines.data : []}
                isError={pipelines.isError}
                isLoading={pipelines.isLoading}
                accessToken={accessToken.isSuccess ? accessToken.data : null}
                enableQuery={accessToken.isSuccess}
              />
            ) : (
              <p className="text-semantic-fg-disabled product-headings-heading-5">
                No pipelines created yet
              </p>
            )}
          </div>
          <div className="relative w-full">
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-semantic-bg-base-bg px-2">
              <p className="product-body-text-3-medium text-semantic-fg-primary">
                Models
              </p>
            </div>
            <Separator orientation="horizontal" />
          </div>
          <div>
            {models.data?.length ? (
              <ModelsTable
                models={models.isSuccess ? models.data : []}
                modelsWatchState={
                  modelsWatchState.isSuccess ? modelsWatchState.data : {}
                }
                isError={models.isError || modelsWatchState.isError}
                isLoading={isLoadingResource}
              />
            ) : (
              <p className="text-semantic-fg-disabled product-headings-heading-5">
                No Models imported yet
              </p>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

OrganizationPage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar logo={<Logo variant="colourLogomark" width={38} />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="p-0">{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default OrganizationPage;
