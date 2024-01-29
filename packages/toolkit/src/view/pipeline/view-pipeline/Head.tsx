import * as React from "react";
import { useRouter } from "next/router";
import { useSortedReleases } from "../../pipeline-builder";
import {
  Button,
  Icons,
  Tag,
  TabMenu,
  Skeleton,
} from "@instill-ai/design-system";
import {
  InstillStore,
  Nullable,
  isPublicPipeline,
  useEntity,
  useInstillStore,
  useOrganization,
  useShallow,
  useUser,
  useUserMe,
  useUserPipeline,
} from "../../../lib";
import { ClonePipelineDialog, EntityAvatar } from "../../../components";
import { EditMetadataDialog } from "./EditMetadataDialog";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const Head = () => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const router = useRouter();
  const { id, entity } = router.query;
  const [selectedTab, setSelectedTab] =
    React.useState<Nullable<string>>("overview");

  const entityObject = useEntity();

  const user = useUser({
    userName: entityObject.entityName,
    accessToken,
    enabled:
      enabledQuery &&
      entityObject.namespaceType === "NAMESPACE_USER" &&
      !!entityObject.entityName,
  });

  const me = useUserMe({
    enabled: enabledQuery,
    accessToken,
    retry: false,
  });

  const organization = useOrganization({
    organizationID: entityObject.isSuccess
      ? entityObject.entityName.split("/")[1]
      : null,
    accessToken,
    enabled:
      enabledQuery &&
      entityObject.isSuccess &&
      entityObject.namespaceType === "NAMESPACE_ORGANIZATION",
  });

  const pipeline = useUserPipeline({
    pipelineName: entityObject.pipelineName,
    accessToken,
    enabled: enabledQuery && entityObject.isSuccess,
  });

  const releases = useSortedReleases({
    pipelineName: entityObject.pipelineName,
    accessToken,
    enabledQuery: enabledQuery && entityObject.isSuccess,
  });

  return (
    <React.Fragment>
      <style jsx>{`
        .org-gradient {
          background: linear-gradient(45deg, #dce7fe, #fef1f2);
        }

        .user-gradient {
          background: linear-gradient(45deg, #efe7fe, #fef1f2);
        }
      `}</style>
      <div className="user-gradient relative flex min-h-[180px] flex-col bg-semantic-bg-primary">
        <div className="flex flex-row px-24 py-16">
          <div className="mr-auto flex max-w-5xl flex-col gap-y-3 ">
            <div className="flex w-full flex-row">
              <div className="mr-auto flex flex-row gap-x-3">
                {entityObject.isSuccess ? (
                  entityObject.namespaceType === "NAMESPACE_ORGANIZATION" ? (
                    <EntityAvatar
                      src={organization.data?.profile_avatar ?? null}
                      entityName={organization.data?.name ?? ""}
                      className="h-6 w-6"
                      fallbackImg={
                        <div className="flex h-6 w-6 rounded-full bg-semantic-bg-secondary">
                          <Icons.User02 className="m-auto h-4 w-4 stroke-semantic-fg-disabled" />
                        </div>
                      }
                    />
                  ) : (
                    <EntityAvatar
                      src={user.data?.profile_avatar ?? null}
                      entityName={user.data?.name ?? ""}
                      className="h-6 w-6"
                      fallbackImg={
                        <div className="flex h-6 w-6 rounded-full bg-semantic-bg-secondary">
                          <Icons.User02 className="m-auto h-4 w-4 stroke-semantic-fg-disabled" />
                        </div>
                      }
                    />
                  )
                ) : (
                  <Skeleton className="h-6 w-6 rounded-full" />
                )}

                {pipeline.isSuccess ? (
                  <React.Fragment>
                    <div className="product-headings-heading-4">
                      <span
                        onClick={() => {
                          router.push(`/${entity}`);
                        }}
                        className="cursor-pointer text-semantic-fg-disabled hover:!underline"
                      >
                        {entity}
                      </span>
                      <span className="text-semantic-fg-disabled">/</span>
                      <span className="text-semantic-fg-primary">{id}</span>
                    </div>
                    {pipeline.isSuccess ? (
                      <Tag className="!py-0" variant="darkBlue" size="sm">
                        {isPublicPipeline(pipeline.data) ? "Public" : "Private"}
                      </Tag>
                    ) : null}
                  </React.Fragment>
                ) : (
                  <PipelineNameSkeleton />
                )}
                {releases[0] ? (
                  <Tag className="!py-0" size="sm" variant="darkBlue">
                    {releases[0]?.id}
                  </Tag>
                ) : null}
              </div>
            </div>
            {pipeline.isSuccess ? (
              <React.Fragment>
                {pipeline.data?.description ? (
                  <div className="flex w-full flex-row">
                    <p className="font-mono text-xs text-semantic-fg-disabled">
                      {pipeline.data?.description}
                    </p>
                    <EditMetadataDialog
                      description={pipeline.data.description}
                    />
                  </div>
                ) : (
                  <div className="flex w-full flex-row items-center gap-x-2">
                    <p className="font-mono text-xs italic text-semantic-fg-disabled">
                      This is a placeholder brief of this pipeline
                    </p>
                    {pipeline.data.permission.can_edit ? (
                      <EditMetadataDialog
                        description={pipeline.data.description}
                      />
                    ) : null}
                  </div>
                )}
              </React.Fragment>
            ) : (
              <PipelineDescriptionSkeleton />
            )}
          </div>
          {pipeline.isSuccess && pipeline.data.permission.can_edit ? (
            <div>
              {/* <EditMetadataDialog
                description={
                  pipeline.isSuccess ? pipeline.data.description : null
                }
              /> */}
            </div>
          ) : null}
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex flex-row px-24">
          <div className="mr-auto">
            <TabMenu.Root
              value={selectedTab}
              onValueChange={(value) => setSelectedTab(value)}
              disabledDeSelect={true}
            >
              <TabMenu.Item value="overview">Overview</TabMenu.Item>
            </TabMenu.Root>
          </div>
          <div className="mt-auto flex flex-row gap-x-2 pb-1">
            {pipeline.isSuccess ? (
              <React.Fragment>
                {me.isSuccess ? (
                  <ClonePipelineDialog
                    trigger={
                      <Button
                        className="items-center gap-x-2"
                        size="sm"
                        variant="secondaryGrey"
                      >
                        <Icons.Copy07 className="h-3 w-3 stroke-semantic-fg-secondary" />
                        Clone
                      </Button>
                    }
                    pipeline={pipeline.data}
                  />
                ) : (
                  <Button
                    onClick={() => {
                      router.push("/login");
                    }}
                    variant="secondaryGrey"
                    size="sm"
                  >
                    Log in to Clone
                  </Button>
                )}
                {pipeline.data.permission.can_edit ? (
                  <Button
                    onClick={() => {
                      router.push(`/${entity}/pipelines/${id}/builder`);
                    }}
                    size="sm"
                    variant="secondaryColour"
                  >
                    Build
                  </Button>
                ) : null}
              </React.Fragment>
            ) : (
              <HeaderControllerSkeleton />
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const PipelineDescriptionSkeleton = () => {
  return (
    <div className="h-4 w-[320px] animate-pulse rounded bg-gradient-to-r from-[#DBDBDB]" />
  );
};

const PipelineNameSkeleton = () => {
  return (
    <div className="h-6 w-[160px] animate-pulse rounded bg-gradient-to-r from-[#DBDBDB]" />
  );
};

const HeaderControllerSkeleton = () => {
  return (
    <React.Fragment>
      <Skeleton className="h-8 w-14 rounded" />
      <Skeleton className="h-8 w-14 rounded" />
    </React.Fragment>
  );
};
