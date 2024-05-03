"use client";

import Image from "next/image";
import { Menu } from "./Menu";
import { Tags } from "./Tags";
import { Stats } from "./Stats";
import { Model } from "../../lib";
import { generateRegionTitle } from "../../lib/generateRegionTitle";

//import { Pipeline } from "../../lib";
/* import { Body } from "./Body";
import { Footer } from "./Footer";
import { Head } from "./Head"; */

/* export const CardSkeletonModel = () => {
  return (
    <div className="flex flex-col gap-y-2 rounded-sm border border-semantic-bg-line">
      <Head.Skeleton />
      <Body.Skeleton />
      <Footer.Skeleton />
    </div>
  );
}; */

export type CardModelProps = {
  model: Model;
}

export const CardModel = (props: CardModelProps) => {
  const { model } = props;

  return (
    <div className="flex flex-row gap-x-6 rounded-md border border-semantic-bg-line p-4 bg-white">
      <Image
        className="rounded shrink-0"
        src="/images/models/model-placeholder.svg"
        alt="model image"
        width={156}
        height={156}
      />
      <div className="flex flex-col grow gap-y-2">
        <div className="flex flex-row w-full gap-x-2 items-start">
          <a href="/" className="break-all text-semantic-accent-default hover:!underline font-medium">{model.id}</a>
          <Tags
            isPrivate={model.visibility === 'VISIBILITY_PRIVATE'}
            region={generateRegionTitle(model.region)}
            hardware={model.hardware}
          />
          <Menu />
        </div>
        <p className="text-semantic-fg-secondary">{model.description}</p>
        <Stats
          task={model.task}
        />
      </div>
      {/* <Head pipeline={pipeline} ownerID={ownerID} isOwner={isOwner} />
      <Body pipeline={pipeline} />
      <Footer
        pipeline={pipeline}
        disabledPermissionLabel={disabledPermissionLabel}
      /> */}
    </div>
  );
};
