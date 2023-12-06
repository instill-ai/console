import * as React from "react";
import { useRouter } from "next/router";
import {
  ModelsTable,
  PageBase,
  PipelinesTable,
  useModels,
  useUser,
  useUserPipelines,
  useWatchUserModels,
  BreadcrumbWithLink,
} from "@instill-ai/toolkit";
import {
  Logo,
  Separator,
  Icons,
  Tag,
  Button,
  Logos,
  GitHubIcon,
} from "@instill-ai/design-system";

import { ConsoleCorePageHead, Topbar } from "../../components";
import { NextPageWithLayout } from "../_app";
import { useAccessToken } from "../../lib/useAccessToken";
import { useTrackToken } from "../../lib/useTrackToken";

const PipelinePage: NextPageWithLayout = () => {
  const router = useRouter();
  const accessToken = useAccessToken();
  useTrackToken({ enabled: true });

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

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

  return (
    <React.Fragment>
      <ConsoleCorePageHead title="profile" />
      <BreadcrumbWithLink
        items={[{ label: "Home", link: "/" }, { label: "Profile" }]}
      />
      <div className="w-full flex flex-row gap-x-14 mt-16">
        <div className="w-1/5 space-y-8">
          <div className="flex flex-col space-y-4 items-center">
            <div className="h-[160px] w-[160px] rounded-[100px] bg-semantic-bg-line my-auto flex items-center justify-center cursor-pointer">
              <Icons.User02 className="h-[84px] w-[84px] stroke-slate-500" />
            </div>
            <div className="flex flex-col items-center space-y-1">
              <h3 className="product-headings-heading-3">Dani Sosa</h3>
              <Tag size="sm">dani-AGI</Tag>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="product-body-text-2-semibold">About</h3>
            <p className="product-body-text-3-regular my-2">
              Dani Sosa is someone who knows someone somewhere near your house.
            </p>
          </div>
          <div>
            <div className="flex gap-x-2 p-2">
              <GitHubIcon
                color="fill-semantic-fg-disabled"
                height="h-[16px]"
                position="my-auto"
                width="w-[16px]"
              />
              <p className="product-button-button-3 my-auto">Username</p>
            </div>
            <div className="flex gap-x-2 p-2">
              <Logos.OpenAI className="w-4 h-4 my-auto" />
              <p className="product-button-button-3 my-auto">Username</p>
            </div>
          </div>

          <div className="space-y-2 flex flex-col">
            <Button variant="secondaryGrey" size="lg">
              Edit Profile
            </Button>
            <Button variant="secondaryGrey" size="lg">
              Settings
            </Button>
          </div>
          <div className="space-y-4">
            <h3 className="product-headings-heading-5">Organisations</h3>
            <Button variant="secondaryGrey" size="lg" className="!p-2">
              <Logos.OpenAI className="w-5 h-5" />
            </Button>
          </div>
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

PipelinePage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar logo={<Logo variant="colourLogomark" width={38} />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="px-28 py-10">{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default PipelinePage;
