import * as React from "react";
import { useRouter } from "next/router";
import { useSortedReleases } from "../../pipeline-builder";
import { Button, Icons, Tag, TabMenu } from "@instill-ai/design-system";
import {
  InstillStore,
  Nullable,
  isPublicPipeline,
  useEntity,
  useInstillStore,
  useOrganization,
  useShallow,
  useUser,
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
      <div className="user-gradient relative flex flex-col bg-semantic-bg-primary">
        <div className="flex flex-col gap-y-3 px-28 py-16">
          <div className="flex flex-row">
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
              ) : null}

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
                <Tag className="!py-0" variant="default" size="sm">
                  {isPublicPipeline(pipeline.data) ? "Public" : "Private"}
                </Tag>
              ) : null}
              {releases[0] ? (
                <Tag className="!py-0" size="sm" variant="darkPurple">
                  {releases[0]?.id}
                </Tag>
              ) : null}
            </div>
            {pipeline.isSuccess && pipeline.data.permission.can_edit ? (
              <EditMetadataDialog
                description={
                  pipeline.isSuccess ? pipeline.data.description : null
                }
              />
            ) : null}
          </div>
          {pipeline.isSuccess ? (
            <div className="flex w-full flex-row">
              <p className="font-mono text-xs italic text-semantic-fg-disabled">
                {pipeline.data.description}
              </p>
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
          <div className="flex flex-row gap-x-2">
            {pipeline.isSuccess ? (
              <ClonePipelineDialog
                trigger={
                  <Button size="sm" variant="secondaryColour">
                    {!pipeline.data.permission.can_edit ? "Clone" : "Duplicate"}
                  </Button>
                }
                pipeline={pipeline.isSuccess ? pipeline.data : null}
              />
            ) : null}
            {pipeline.isSuccess && pipeline.data.permission.can_edit ? (
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
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
