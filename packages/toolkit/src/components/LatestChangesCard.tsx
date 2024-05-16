import { Icons } from "@instill-ai/design-system";
import { useChangelogs } from "../lib/react-query-service/misc/useChangelogs";

interface Changelog {
  id: string;
  createdAt: string;
  updatedAt: string;
  date: string | null;
  title: string;
  published: boolean;
}

const LatestChangesCard: React.FC = () => {
  const changelogs = useChangelogs();

  if (changelogs.isLoading) {
    return (
      <div className="flex w-full flex-row gap-x-2 p-3">
        <div className="my-auto h-8 w-8 shrink-0 grow-0 animate-pulse rounded-full bg-semantic-bg-secondary" />
        <div className="h-[38px] w-20 animate-pulse rounded bg-semantic-bg-secondary"></div>
      </div>
    );
  }

  if (changelogs.isError) {
    return <div>Error fetching changelogs.</div>;
  }

  return (
    <div className="mt-4 flex flex-col gap-y-2 rounded-sm border border-semantic-bg-line p-4">
      <h2 className="mb-4 text-product-headings-heading-3 font-bold">Latest Changes</h2>
      {changelogs.isSuccess &&
        changelogs.data.map((changelog: Changelog) => (
          <div key={changelog.id}>
            <button
              type="button"
              className="my-auto flex-auto rounded-sm bg-semantic-accent-bg p-2 capitalize text-semantic-accent-default product-button-button-2 hover:!underline"
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
            </button>
            <p>{changelog.title}</p>
          </div>
        ))}
      <a href="https://instill-ai.productlane.com/changelog" target="_blank" rel="noopener noreferrer">
        <div className="my-auto ml-2 mt-4 flex justify-start text-semantic-accent-default product-button-button-2 hover:!underline">
          View changelog
          <Icons.ChevronRight className="my-auto h-4 w-4 stroke-semantic-accent-default" />
        </div>
      </a>
    </div>
  );
};

export default LatestChangesCard;