import { Pipeline } from "../../lib";
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

export const CardPipeline = (props: {
  ownerID: string;
  pipeline: Pipeline;
  isOrg: boolean;
  isOwner: boolean;
}) => {
  const { ownerID, pipeline, isOrg, isOwner } = props;

  return (
    <div className="flex flex-col gap-y-2 rounded-sm border border-semantic-bg-line">
      <Head
        pipeline={pipeline}
        ownerID={ownerID}
        isOrg={isOrg}
        isOwner={isOwner}
      />
      <Body ownerID={ownerID} pipeline={pipeline} />
      <Footer ownerID={ownerID} pipeline={pipeline} isOwner={isOwner} />
    </div>
  );
};
