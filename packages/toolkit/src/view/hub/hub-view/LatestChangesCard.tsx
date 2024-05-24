import cn from "clsx";
import { Icons, Separator, Skeleton, buttonVariants } from "@instill-ai/design-system";
import { useChangelogs } from "../../../lib";

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
      <div className="mb-4 font-bold product-headings-heading-3">
        Latest Changes
      </div>

      {changelogs.isSuccess && (
        <div className="relative mb-4">
          {changelogs.data.map((changelog: Changelog, index: number) => (
            <div key={changelog.id} className="relative pb-4">
              <div className="absolute top-1  h-3 w-3 rounded-full bg-slate-300" />
              {index !== changelogs.data.length && (
                <Separator className="absolute top-4 bottom-0 w-0.5 left-1.5 bg-semantic-node-disconnected-bg pb-4" orientation="vertical" />
              )}
              <a
                href={`https://instill-ai.productlane.com/changelog/${changelog.id}`}
                target="_blank"
                rel="noopener noreferrer"
              // className="ml-10"
              >
                <div className="mb-1 w-min whitespace-nowrap capitalize text-semantic-accent-default text-xs font-semibold ml-6">
                  {changelog.date && new Date(changelog.date).getTime() !== 0
                    ? new Date(changelog.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                    : new Date(changelog.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                </div>
                <p className="text-semantic-fg-primary product-body-text-3-regular hover:underline ml-6">
                  {changelog.title}
                </p>
              </a>
            </div>
          ))}
        </div>
      )}

      <a
        href="https://instill-ai.productlane.com/changelog"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="my-auto ml-2 flex justify-start text-semantic-accent-default product-button-button-3 hover:!underline items-center gap-2">
          View changelog
          <Icons.ChevronRight className="h-4 w-4 stroke-semantic-accent-default" />
        </div>
      </a>
    </div>
  );
};