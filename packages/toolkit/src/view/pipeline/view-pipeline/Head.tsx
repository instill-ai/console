import * as React from "react";
import { useRouter } from "next/router";
import {
  NodeData,
  checkIsValidPosition,
  createGraphLayout,
  createInitialGraphData,
  useSortedReleases,
} from "../../pipeline-builder";
import {
  Button,
  Icons,
  Tag,
  TabMenu,
  Skeleton,
  Select,
  Popover,
  ScrollArea,
  toast,
} from "@instill-ai/design-system";
import {
  InstillStore,
  Nullable,
  getHumanReadableStringFromTime,
  isPublicPipeline,
  toastInstillError,
  useDeleteUserPipeline,
  useEntity,
  useInstillStore,
  useOrganization,
  useShallow,
  useUser,
  useAuthenticatedUser,
  useUserPipeline,
} from "../../../lib";
import { ClonePipelineDialog, EntityAvatar } from "../../../components";
import { EditMetadataDialog } from "./EditMetadataDialog";
import cn from "clsx";
import { Edge, Node } from "reactflow";
import { Menu } from "./Menu";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  pipelineName: store.pipelineName,
  pipelineIsNew: store.pipelineIsNew,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  nodes: store.nodes,
  currentVersion: store.currentVersion,
  updateCurrentVersion: store.updateCurrentVersion,
  updateSelectedConnectorNodeId: store.updateSelectedConnectorNodeId,
});

export const Head = () => {
  const {
    accessToken,
    enabledQuery,
    updateNodes,
    updateEdges,
    currentVersion,

    updateCurrentVersion,
    updateSelectedConnectorNodeId,
  } = useInstillStore(useShallow(selector));

  const router = useRouter();
  const { id, entity } = router.query;
  const [selectedTab, setSelectedTab] =
    React.useState<Nullable<string>>("overview");

  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const entityObject = useEntity();

  const user = useUser({
    userName: entityObject.entityName,
    accessToken,
    enabled:
      enabledQuery &&
      entityObject.namespaceType === "NAMESPACE_USER" &&
      !!entityObject.entityName,
  });

  const me = useAuthenticatedUser({
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

  const deletePipeline = useDeleteUserPipeline();
  async function handleDeletePipeline() {
    try {
      await deletePipeline.mutateAsync({
        pipelineName: pipeline.data?.name || "",
        accessToken: accessToken ? accessToken : null,
      });

      toast({
        title: "Pipeline deleted",
        variant: "alert-success",
        size: "large",
      });
    } catch (error) {
      toastInstillError({
        title: "Something went wrong when delete the pipeline",
        error,
        toast,
      });
    }
  }

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
                      src={organization.data?.profile?.avatar ?? null}
                      entityName={organization.data?.name ?? ""}
                      className="my-auto h-6 w-6"
                      fallbackImg={
                        <div className="flex h-6 w-6 rounded-full bg-semantic-bg-secondary">
                          <Icons.User02 className="m-auto h-4 w-4 stroke-semantic-fg-disabled" />
                        </div>
                      }
                    />
                  ) : (
                    <EntityAvatar
                      src={user.data?.profile?.avatar ?? null}
                      entityName={user.data?.name ?? ""}
                      className="my-auto h-6 w-6"
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

                {releases && pipeline.isSuccess ? (
                  <React.Fragment>
                    <div className="my-auto product-headings-heading-4">
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
                      <Tag
                        className="my-auto h-[24px] !py-0"
                        variant="darkBlue"
                        size="sm"
                      >
                        {isPublicPipeline(pipeline.data) ? "Public" : "Private"}
                      </Tag>
                    ) : null}

                    {releases && pipeline.isSuccess ? (
                      <Popover.Root open={isOpen}>
                        <Popover.Trigger asChild={true} className="my-auto">
                          <Button
                            className="gap-x-1"
                            size="sm"
                            variant="tertiaryColour"
                            type="button"
                            onClick={() => setIsOpen(true)}
                          >
                            <Tag
                              size="sm"
                              variant="darkPurple"
                              className="h-[24px] gap-x-2"
                            >
                              Version{" "}
                              {currentVersion === "latest"
                                ? releases[0]?.id
                                : currentVersion}
                            </Tag>
                            <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-primary" />
                          </Button>
                        </Popover.Trigger>
                        <Popover.Content
                          side="top"
                          sideOffset={4}
                          align="start"
                          className="flex h-[200px] w-[160px] flex-col !p-0"
                        >
                          <ScrollArea.Root>
                            <div className="flex flex-col gap-y-1 p-0.5">
                              {releases.length > 0 ? (
                                <React.Fragment>
                                  {releases.map((release) => (
                                    <VersionButton
                                      key={release.id}
                                      id={release.id}
                                      currentVersion={
                                        currentVersion === "latest"
                                          ? releases[0].id
                                          : currentVersion
                                      }
                                      createTime={release.create_time}
                                      onClick={() => {
                                        updateSelectedConnectorNodeId(
                                          () => null
                                        );

                                        updateCurrentVersion(() => release.id);

                                        let newNodes: Node<NodeData>[] = [];
                                        let newEdges: Edge[] = [];

                                        if (
                                          checkIsValidPosition(
                                            release.recipe,
                                            release.metadata ?? null
                                          )
                                        ) {
                                          const { nodes, edges } =
                                            createInitialGraphData(
                                              release.recipe,
                                              {
                                                metadata: release.metadata,
                                              }
                                            );
                                          newNodes = nodes;
                                          newEdges = edges;
                                        } else {
                                          const { nodes, edges } =
                                            createInitialGraphData(
                                              release.recipe
                                            );
                                          newNodes = nodes;
                                          newEdges = edges;
                                        }

                                        createGraphLayout(newNodes, newEdges)
                                          .then((graphData) => {
                                            updateNodes(() => graphData.nodes);
                                            updateEdges(() => graphData.edges);
                                          })
                                          .catch((err) => {
                                            console.error(err);
                                          });
                                        setIsOpen(false);
                                      }}
                                    />
                                  ))}
                                </React.Fragment>
                              ) : (
                                <div className="p-2 text-semantic-fg-disabled product-body-text-4-medium">
                                  This pipeline has no released versions.
                                </div>
                              )}
                            </div>
                          </ScrollArea.Root>
                        </Popover.Content>
                      </Popover.Root>
                    ) : null}
                  </React.Fragment>
                ) : (
                  <PipelineNameSkeleton />
                )}
              </div>
            </div>
            {pipeline.isSuccess ? (
              <React.Fragment>
                {pipeline.data?.description ? (
                  <div className="flex w-full flex-row items-center gap-x-2">
                    <p className="font-mono text-xs text-semantic-fg-disabled">
                      {pipeline.data?.description}
                    </p>
                    <EditMetadataDialog
                      description={pipeline.data.description}
                    />
                  </div>
                ) : (
                  <div className="flex w-full flex-row items-center gap-x-2 p-1">
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
              <Menu
                pipeline={pipeline.data}
                handleDeletePipeline={handleDeletePipeline}
              />
            ) : null}

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

const VersionButton = ({
  id,
  currentVersion,
  onClick,
  createTime,
}: {
  id: string;
  currentVersion: Nullable<string>;
  createTime?: string;
  onClick: () => void;
}) => {
  return (
    <Button
      key={id}
      className={cn(
        "w-full",
        currentVersion === id ? "hover:!bg-semantic-accent-default" : ""
      )}
      variant={currentVersion === id ? "primary" : "tertiaryColour"}
      onClick={onClick}
    >
      <div className="flex w-full flex-row gap-x-2">
        <div className="my-auto h-2 w-2 rounded-full bg-semantic-secondary-default"></div>
        <p
          className={cn(
            "w-full text-left product-body-text-3-medium",
            currentVersion === id
              ? "text-semantic-fg-on-default"
              : "text-semantic-fg-secondary"
          )}
        >
          Version {id}
        </p>
      </div>
    </Button>
  );
};
