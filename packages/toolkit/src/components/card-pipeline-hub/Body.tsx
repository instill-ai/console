"use client";

import { Icons, Tag } from "@instill-ai/design-system";
import { Pipeline } from "../../lib";
import { useRouter } from "next/navigation";

const BodySkeleton = () => {
  return (
    <div className="flex w-full flex-col px-2">
      <div className="mb-2 h-5 w-1/2 animate-pulse rounded bg-semantic-bg-secondary" />
      <div className="h-[250px] w-full animate-pulse bg-semantic-bg-secondary" />
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

export const Body = ({
  pipeline,
}: {
  pipeline: Pipeline;
}) => {
  const router = useRouter();
  return (
    <div className="flex w-full flex-col gap-y-2">
      <div className="flex flex-row gap-x-2 px-3">
        <Icons.Pipeline className="my-auto h-4 w-4 stroke-semantic-accent-default" />
        <button
          type="button"
          className="my-auto !normal-case text-semantic-accent-default product-button-button-2 hover:!underline"
          onClick={() => {
            router.push(
              `/${pipeline.owner_name.split("/")[1]}/pipelines/${pipeline.id}`
            );
          }}
        >
          {pipeline.id}
        </button>
        {pipeline.isFeatured && (
          <Tag
            className="my-auto rounded-md bg-semantic-secondary-bg  p-2 !normal-case text-semantic-secondary-on-bg product-button-button-2 hover:!underline"
          >
            Featured
          </Tag>
        )}
      </div>
      <div className="flex w-full px-3 pb-3">
        <p className="line-clamp-3 font-mono text-xs font-normal text-semantic-fg-secondary">
          {pipeline.description}
        </p>
      </div>
      <div className="flex w-full justify-end px-3 pb-3">
        <p className="line-clamp-3 text-xs font-semibold text-semantic-fg-disabled">
          {formatTimestamp(pipeline.update_time)}
        </p>
      </div>
    </div>
  );
};

Body.Skeleton = BodySkeleton;
