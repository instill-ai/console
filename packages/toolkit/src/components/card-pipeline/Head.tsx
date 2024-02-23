import { useRouter } from "next/router";
import {
  InstillStore,
  Pipeline,
  toastInstillError,
  useDeleteUserPipeline,
  useInstillStore,
  useShallow,
} from "../../lib";
import { Icons, useToast } from "@instill-ai/design-system";
import { Menu } from "./Menu";
import { EntityAvatar } from "../EntityAvatar";

export const HeadSkeleton = () => {
  return (
    <div className="flex w-full flex-row gap-x-2 p-3">
      <div className="my-auto h-8 w-8 shrink-0 grow-0 animate-pulse rounded-full bg-semantic-bg-secondary" />
      <div className="h-[38px] w-20 animate-pulse rounded bg-semantic-bg-secondary"></div>
    </div>
  );
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const Head = ({
  ownerID,
  isOwner,
  pipeline,
}: {
  ownerID: string;
  isOwner: boolean;
  pipeline: Pipeline;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const { accessToken } = useInstillStore(useShallow(selector));

  const deletePipeline = useDeleteUserPipeline();
  async function handleDeletePipeline() {
    try {
      await deletePipeline.mutateAsync({
        pipelineName: pipeline.name,
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
    <div className="flex flex-row p-3">
      <div className="mr-auto flex flex-row gap-x-2">
        <EntityAvatar
          src={pipeline.owner?.profile?.avatar ?? null}
          className="h-8 w-8"
          entityName={ownerID}
          fallbackImg={
            <div className="my-auto flex h-8 w-8 shrink-0 grow-0 rounded-full bg-semantic-bg-line">
              <Icons.User02 className="m-auto h-4 w-4 stroke-semantic-fg-disabled" />
            </div>
          }
        />
        <button
          type="button"
          className="my-auto !normal-case text-semantic-accent-default product-button-button-2 hover:!underline"
          onClick={() => {
            router.push(`/${ownerID}`);
          }}
        >
          {ownerID}
        </button>
      </div>
      {isOwner ? (
        <Menu pipeline={pipeline} handleDeletePipeline={handleDeletePipeline} />
      ) : null}
    </div>
  );
};
Head.Skeleton = HeadSkeleton;
