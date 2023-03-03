import {
  DestinationWithPipelines,
  ModelWithInstance,
  Pipeline,
  SourceWithPipelines,
} from "@/lib/instill";
import { Nullable } from "@/types/general";
import { chunk } from "@/utils/chunk";
import { useEffect, useState } from "react";

type Resources =
  | DestinationWithPipelines
  | ModelWithInstance
  | Pipeline
  | SourceWithPipelines;

export function useResourcePages<T extends Resources>({
  resources,
  searchTerm,
  pageSize,
}: {
  resources: Nullable<T[]>;
  searchTerm: Nullable<string>;
  pageSize: number;
}) {
  const [resourcePages, setResourcePages] = useState<T[][]>([]);

  useEffect(() => {
    if (!resources) {
      return;
    }

    if (!searchTerm) {
      setResourcePages(chunk(resources, pageSize));
      return;
    }

    // We need to consider using the tanstack-table

    const searchResources = async (resources: T[], searchTerm: string) => {
      const Fuse = (await import("fuse.js")).default;
      const fuse = new Fuse(resources, {
        keys: ["id", "instances.id"],
      });

      setResourcePages(
        chunk(
          fuse.search(searchTerm).map((e) => e.item),
          pageSize
        )
      );
    };

    searchResources(resources, searchTerm);
  }, [resources, searchTerm, pageSize]);

  return resourcePages;
}
