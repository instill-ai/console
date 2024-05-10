"use client";

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
  isOwner: boolean;
  disabledPermissionLabel?: boolean;
  isHub?: boolean;
}) => {
  const { ownerID, pipeline, isOwner, disabledPermissionLabel, isHub } = props;

  return (
    <div className="flex flex-col gap-y-2 rounded-sm border border-semantic-bg-line">
      <Head pipeline={pipeline} ownerID={ownerID} isOwner={isOwner} />
      <Body pipeline={pipeline} isHub={isHub}/>

      {!isHub && (
        <>
          <Footer
            pipeline={pipeline}
            disabledPermissionLabel={disabledPermissionLabel}
          />
        </>
      )}
    </div>
  );
};
