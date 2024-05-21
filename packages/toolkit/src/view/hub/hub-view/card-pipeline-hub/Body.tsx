"use client";

import { Button, Icons, Skeleton, Tag } from "@instill-ai/design-system";
import { Pipeline } from "../../../../lib";
import { useRouter } from "next/navigation";

const BodySkeleton = () => {
  return (
    <div className="flex w-full flex-col px-2 pb-4">
      <Skeleton className="mb-2 h-5 w-1/2 rounded" />
      <Skeleton className="h-[120px] w-full" />
    </div>
  );
};

const formatTimestamp = (timestamp: string) => {
  const currentDate = new Date();
  const updatedDate = new Date(timestamp);
  const timeDiff = currentDate.getTime() - updatedDate.getTime();

  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `Updated ${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `Updated ${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `Updated ${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return `Updated ${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  }
};

export const Body = ({ pipeline }: { pipeline: Pipeline }) => {
  const router = useRouter();
  return (
    <div className="flex w-full flex-col gap-y-2 pb-4">
      <div className="flex flex-row items-center gap-x-2 px-3">
        <Icons.Pipeline className="my-auto h-4 w-4 stroke-semantic-accent-default" />
        <a
          href={`/${pipeline.owner_name.split("/")[1]}/pipelines/${pipeline.id}`}
          className="font-sans text-sm font-semibold text-semantic-accent-default hover:underline"
        >
          {pipeline.id}
        </a>
        {pipeline.tags.includes("featured") && (
          <Tag
            variant="lightPurple"
            className="my-auto border-none product-body-text-3-medium"
          >
            Featured
          </Tag>
        )}
      </div>
      {pipeline.description ? (
        <div className="flex w-full px-3">
          <p className="line-clamp-3 font-mono text-xs font-normal text-semantic-fg-secondary">
            {pipeline.description}
          </p>
        </div>
      ) : null}

      <div className="flex w-full justify-end px-3 pt-2">
        <p className="line-clamp-3 text-semantic-node-disconnected-default-stroke product-body-text-4-regular">
          {formatTimestamp(pipeline.update_time)}
        </p>
      </div>
    </div>
  );
};

Body.Skeleton = BodySkeleton;
