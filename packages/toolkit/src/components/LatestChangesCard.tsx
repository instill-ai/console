"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Icons } from "@instill-ai/design-system";

interface Changelog {
  id: string;
  createdAt: string;
  updatedAt: string;
  date: string | null;
  title: string;
  published: boolean;
}

const LatestChangesCard: React.FC = () => {
  const [changelogs, setChangelogs] = useState<Changelog[]>([]);

  useEffect(() => {
    axios
      .get(
        "https://productlane.com/api/v1/changelogs/52f06d0d-2381-411e-a8c5-7b375e3a0114"
      )
      .then((response) => {
        const data: Changelog[] = response.data;
        const filteredAndSortedChangelogs = data
          .filter((changelog) => changelog.published)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        setChangelogs(filteredAndSortedChangelogs.slice(0, 3));
      })
      .catch((error) => {
        console.error("Error fetching changelogs:", error);
      });
  }, []);

  return (
    <div className="mt-4 flex flex-col gap-y-2 rounded-sm border border-semantic-bg-line p-4">
      <h2 className="mb-4 text-2xl font-bold">Latest Changes</h2>
      {changelogs.map((changelog) => (
        <div key={changelog.id}>
          <button
            type="button"
            className="my-auto flex-auto rounded-sm bg-blue-100 p-2 capitalize text-semantic-accent-default product-button-button-2 hover:!underline"
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
      <a
        href="https://instill-ai.productlane.com/changelog"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button
          type="button"
          className="my-auto ml-2 mt-4 flex justify-start text-semantic-accent-default product-button-button-2 hover:!underline"
        >
          View changelog
          <Icons.ChevronRight className="my-auto h-4 w-4 stroke-semantic-accent-default" />
        </button>
      </a>
    </div>
  );
};

export default LatestChangesCard;
