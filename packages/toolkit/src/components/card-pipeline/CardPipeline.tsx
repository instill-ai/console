import { ReadOnlyPipelineBuilderProps } from "../../view";
import { Body } from "./Body";
import { Footer } from "./Footer";
import { Head } from "./Head";

export const CardSkeletonPipeline = () => {
  return (
    <div className="flex flex-col gap-y-2 rounded-sm border border-semantic-bg-line">
      <Head.Skeleton />
      <Body.Skeleton />
      <Footer.Skeleton />
    </div>
  );
};

export const CardPipeline = ({
  ownerID,
  pipelineID,
  recipe,
  metadata,
}: {
  ownerID: string;
  pipelineID: string;
} & ReadOnlyPipelineBuilderProps) => {
  console.log("ownerID", ownerID);

  return (
    <div className="flex flex-col gap-y-2 rounded-sm border border-semantic-bg-line">
      <Head ownerID={ownerID} />
      <Body
        ownerID={ownerID}
        recipe={recipe}
        metadata={metadata}
        pipelineID={pipelineID}
      />
      <Footer
        ownerID={ownerID}
        pipelineID={pipelineID}
        pipelineLatestVersion="v1.0.0"
        isOwner={true}
      />
    </div>
  );
};
