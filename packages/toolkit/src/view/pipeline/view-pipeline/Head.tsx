import * as React from "react";
import { useRouter } from "next/router";
import {
  getRawPipelineRecipeFromPipelineRecipe,
  useSortedReleases,
} from "../../pipeline-builder";
import {
  Button,
  Icons,
  Tag,
  TabMenu,
  useToast,
} from "@instill-ai/design-system";
import {
  CreateUserPipelinePayload,
  InstillStore,
  Nullable,
  generateRandomReadableName,
  toastInstillError,
  useCreateUserPipeline,
  useEntity,
  useInstillStore,
  useOrganization,
  useShallow,
  useUser,
  useUserMe,
  useUserPipeline,
} from "../../../lib";
import { EntityAvatar, LoadingSpin } from "../../../components";
import { EditMetadataDialog } from "./EditMetadataDialog";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const Head = ({ isOwner }: { isOwner: boolean }) => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const router = useRouter();
  const { id, entity } = router.query;
  const [selectedTab, setSelectedTab] =
    React.useState<Nullable<string>>("overview");
  const [isCloning, setIsCloning] = React.useState(false);

  const { toast } = useToast();

  const entityObject = useEntity();

  const me = useUserMe({
    enabled: enabledQuery,
    accessToken,
  });

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

  const createPipeline = useCreateUserPipeline();

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
              {releases[0] ? (
                <Tag size="sm" variant="darkPurple">
                  {releases[0]?.id}
                </Tag>
              ) : null}
            </div>
            {isOwner ? (
              <EditMetadataDialog
                description={
                  pipeline.isSuccess ? pipeline.data.description : null
                }
              />
            ) : null}
          </div>
          {/* <div className="flex w-full flex-row flex-wrap">
            <Tag size="sm" variant="default">
              Stability-AI
            </Tag>
          </div> */}
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
            <Button
              size="sm"
              variant="secondaryColour"
              className="flex flex-row gap-x-2"
              onClick={async () => {
                if (!me.isSuccess || !pipeline.isSuccess || !accessToken) {
                  return;
                }

                setIsCloning(true);

                const payload: CreateUserPipelinePayload = {
                  id: generateRandomReadableName(),
                  recipe: getRawPipelineRecipeFromPipelineRecipe(
                    pipeline.data.recipe
                  ),
                  metadata: pipeline.data?.metadata,
                };

                try {
                  await createPipeline.mutateAsync({
                    payload,
                    accessToken,
                    entityName: me.data.name,
                  });

                  setIsCloning(false);

                  await router.push(`/${me.data.id}/pipelines/${payload.id}`);

                  router.reload();

                  toast({
                    title: "Successfully cloned the pipeline",
                    variant: "alert-success",
                    size: "small",
                  });
                } catch (error) {
                  setIsCloning(false);
                  toastInstillError({
                    title:
                      "Something went wrong when clone the pipeline, please try again later",
                    error,
                    toast,
                  });
                }
              }}
            >
              {!accessToken ? (
                "Login to Clone"
              ) : isCloning ? (
                <LoadingSpin />
              ) : (
                <React.Fragment>
                  <Icons.Copy07 className="h-3 w-3 stroke-semantic-accent-default" />
                  Clone
                </React.Fragment>
              )}
            </Button>
            {isOwner ? (
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
