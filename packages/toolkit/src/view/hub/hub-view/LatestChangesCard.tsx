import { Icons, Skeleton, buttonVariants } from "@instill-ai/design-system";
import { useChangelogs } from "../../../lib/react-query-service/misc/useChangelogs";
import cn from "clsx";

type Changelog = {
  id: string;
  createdAt: string;
  updatedAt: string;
  date: string | null;
  title: string;
  published: boolean;
};

const LatestChangesCard: React.FC = () => {
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
    <div className="mt-4 flex flex-col gap-y-4 rounded-sm border border-semantic-bg-line p-4">
      <div className="font-bold product-headings-heading-3">Latest Changes</div>
      {changelogs.isSuccess &&
        changelogs.data.map((changelog: Changelog) => (
          <div key={changelog.id}>
            <div
              className={cn(
                buttonVariants({ variant: "secondaryColour", size: "md" }),
                "pointer-events-none w-min whitespace-nowrap rounded-sm px-2 py-2 capitalize"
              )}
            >
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
            <p>{changelog.title}</p>
          </div>
        ))}
      <a
        href="https://instill-ai.productlane.com/changelog"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="my-auto ml-2 mt-4 flex justify-start text-semantic-accent-default product-button-button-2 hover:!underline">
          View changelog
          <Icons.ChevronRight className="my-auto h-4 w-4 stroke-semantic-accent-default" />
        </div>
      </a>
    </div>
  );
};

export default LatestChangesCard;
