import { Icons, LinkButton } from "@instill-ai/design-system";
import {
  ReadOnlyPipelineBuilder,
  ReadOnlyPipelineBuilderProps,
} from "../../view";

const BodySkeleton = () => {
  return (
    <div className="flex w-full flex-col px-2">
      <div className="mb-2 h-5 w-1/2 animate-pulse rounded bg-semantic-bg-secondary" />
      <div className="h-[250px] w-full animate-pulse bg-semantic-bg-secondary" />
    </div>
  );
};

export const Body = ({
  pipelineID,
  recipe,
  metadata,
}: { pipelineID: string } & ReadOnlyPipelineBuilderProps) => {
  return (
    <div className="flex w-full flex-col px-2">
      <div className="mb-2 flex flex-row">
        <Icons.Pipeline className="h-4 w-4 stroke-semantic-accent-default" />
        <LinkButton size="md" variant="primary">
          {pipelineID}
        </LinkButton>
      </div>
      <ReadOnlyPipelineBuilder
        recipe={recipe}
        metadata={metadata}
        className="h-[250px] w-full"
      />
    </div>
  );
};
Body.Skeleton = BodySkeleton;
