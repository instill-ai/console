import { Icons, Skeleton } from "@instill-ai/design-system";
import { useChangelogs } from "../../../lib";
import * as React from "react";

type Changelog = {
  id: string;
  createdAt: string;
  updatedAt: string;
  date: string | null;
  title: string;
  published: boolean;
};

export const LatestChangesCard = () => {
  const changelogs = useChangelogs();

  if (changelogs.isLoading) {
    return (
      <div className="mt-4 flex flex-col gap-y-4 rounded-sm border border-semantic-bg-line p-4">
        <Skeleton className="h-6 w-32 rounded bg-semantic-bg-line" />
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-y-2">
            <Skeleton className="h-6 w-24 rounded bg-semantic-bg-line" />
            <Skeleton className="h-6 w-full rounded bg-semantic-bg-line" />
          </div>
        ))}
        <div className="mt-4 flex items-center space-x-2">
          <Skeleton className="h-4 w-24 rounded bg-semantic-bg-line" />
          <Skeleton className="h-4 w-4 rounded bg-semantic-bg-line" />
        </div>
      </div>
    );
  }

  if (changelogs.isError) {
    return <div>Error fetching changelogs.</div>;
  }

  return (
    <div className="flex flex-col rounded-sm border border-semantic-bg-line bg-semantic-bg-primary p-4">
      <div className="mb-4 font-bold product-body-text-3-semibold">
        Latest Changes
      </div>

      {changelogs.isSuccess && (
        <div className="mb-2 grid grid-cols-[auto_1fr] ">
          {changelogs.data.map((changelog: Changelog, index: number) => (
            <React.Fragment key={changelog.id}>
              <div className="relative flex items-start  justify-center ">
                <div className="inline-flex h-3 w-3 items-center justify-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                </div>
                {index !== changelogs.data.length && (
                  <div className="absolute bottom-0 left-1/2 top-3 w-0.5 -translate-x-1/2 rounded-full bg-semantic-node-disconnected-bg" />
                )}
              </div>
              <a
                href={`https://instill-ai.productlane.com/changelog/${changelog.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 pb-4"
              >
                <div className="-mt-0.5 mb-1 w-min whitespace-nowrap text-xs font-semibold capitalize text-semantic-accent-default">
                  {changelog.date && new Date(changelog.date).getTime() !== 0
                    ? new Date(changelog.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                    : new Date(changelog.updatedAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                </div>
                <p className="text-semantic-fg-primary product-body-text-3-regular hover:underline">
                  {changelog.title}
                </p>
              </a>
            </React.Fragment>
          ))}
        </div>
      )}

      <a
        href="https://instill-ai.productlane.com/changelog"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="my-auto ml-2 flex items-center gap-2 text-semantic-accent-default product-button-button-3 hover:!underline">
          View changelog
          <Icons.ChevronRight className="h-4 w-4 stroke-semantic-accent-default" />
        </div>
      </a>
    </div>
  );
};
