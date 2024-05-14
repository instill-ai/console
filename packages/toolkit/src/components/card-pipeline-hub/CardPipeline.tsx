"use client";

import { Pipeline } from "../../lib";
import { Body } from "./Body";
import { Head } from "./Head";

export const CardSkeletonPipeline = () => {
  return (
    <div className="flex flex-col gap-y-2 rounded-sm border border-semantic-bg-line">
      <Head.Skeleton />
      <Body.Skeleton />
    </div>
  );
};

export const CardPipeline = (props: {
  ownerID: string;
  pipeline: Pipeline;
  isOwner: boolean;
  disabledPermissionLabel?: boolean;
}) => {
  const { ownerID, pipeline, isOwner, disabledPermissionLabel } =
    props;

  return (
    <div className="flex flex-col gap-y-2 rounded-sm border border-semantic-bg-line">
      <Head pipeline={pipeline} ownerID={ownerID} isOwner={isOwner} />
      <Body pipeline={pipeline} />
    </div>
  );
};
