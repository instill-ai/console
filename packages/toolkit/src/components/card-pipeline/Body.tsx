import { Icons } from "@instill-ai/design-system";
import {
  ReadOnlyPipelineBuilder,
  ReadOnlyPipelineBuilderProps,
} from "../../view";
import { useRouter } from "next/router";

const BodySkeleton = () => {
  return (
    <div className="flex w-full flex-col px-2">
      <div className="mb-2 h-5 w-1/2 animate-pulse rounded bg-semantic-bg-secondary" />
      <div className="h-[250px] w-full animate-pulse bg-semantic-bg-secondary" />
    </div>
  );
};

export const Body = ({
  ownerID,
  pipelineID,
  recipe,
  metadata,
}: { ownerID: string; pipelineID: string } & ReadOnlyPipelineBuilderProps) => {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col">
      <div className="mb-2 flex flex-row gap-x-2 px-3">
        <Icons.Pipeline className="my-auto h-4 w-4 stroke-semantic-accent-default" />
        <button
          type="button"
          className="my-auto !normal-case text-semantic-accent-default product-button-button-2 hover:!underline"
          onClick={() => {
            router.push(`/${ownerID}/pipelines/${pipelineID}`);
          }}
        >
          {pipelineID}
        </button>
      </div>
      <ReadOnlyPipelineBuilder
        recipe={recipe}
        metadata={metadata}
        className="h-[250px] w-full !border-none !px-0"
      />
    </div>
  );
};
Body.Skeleton = BodySkeleton;
