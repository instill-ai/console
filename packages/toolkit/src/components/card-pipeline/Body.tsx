"use client";

import { Icons } from "@instill-ai/design-system";
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
          <button
            type="button"
            className="my-auto rounded-md bg-[#F8F5FF] p-2 !normal-case text-[#6E35DE] product-button-button-2 hover:!underline"
          >
            Featured
          </button>
        )}
      </div>
      <div className="flex w-full px-3 pb-3">
        <p className="line-clamp-3 font-mono text-xs font-normal text-semantic-fg-secondary">
          {pipeline.description}
        </p>
      </div>
      <div className="flex w-full justify-end px-3 pb-3">
        <p className="line-clamp-3 text-xs font-normal text-gray-400">
          TODO Clone
        </p>
      </div>
    </div>
  );
};

Body.Skeleton = BodySkeleton;