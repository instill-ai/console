import {
  DestinationWithPipelines,
  ModelWithInstance,
  Pipeline,
  SourceWithPipelines,
} from "@/lib/instill";
import { Nullable } from "@/types/general";
import { useEffect, useState } from "react";

type Resources =
  | DestinationWithPipelines
  | ModelWithInstance
  | Pipeline
  | SourceWithPipelines;

export function useSearchedResources<T extends Resources>({
  resources,
  searchTerm,
}: {
  resources: Nullable<T[]>;
  searchTerm: Nullable<string>;
}) {
  const [searchedResources, setSearchedResources] = useState<T[]>([]);

  useEffect(() => {
    if (!resources) {
      return;
    }

    if (!searchTerm) {
      setSearchedResources(resources);
      return;
    }

    // We need to consider using the tanstack-table

    const searchResources = async (resources: T[], searchTerm: string) => {
      const Fuse = (await import("fuse.js")).default;
      const fuse = new Fuse(resources, {
        keys: ["id", "instances.id"],
        threshold: 0.5,
      });

      setSearchedResources(fuse.search(searchTerm).map((e) => e.item));
    };

    searchResources(resources, searchTerm);
  }, [resources, searchTerm]);

  return searchedResources;
}
