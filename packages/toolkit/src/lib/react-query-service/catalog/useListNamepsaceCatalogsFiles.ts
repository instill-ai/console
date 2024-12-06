"use client";

import type { Catalog, File, Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillCatalogAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export type TempCatalogFiles = {
  files: File[];
  isTemp: true;
  catalogId: string;
};

export type PersistentCatalogFiles = {
  isTemp: false;
  files: File[];
} & Catalog;

export type CatalogFiles = TempCatalogFiles | PersistentCatalogFiles;

export function useListNamespaceCatalogsFiles({
  namespaceId,
  catalogIds,
  accessToken,
  enabled,
}: {
  namespaceId: Nullable<string>;
  catalogIds: string[];
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  return useQuery({
    queryKey: queryKeyStore.catalog.getUseListNamespaceCatalogsFilesQueryKey({
      namespaceId,
      catalogIds,
    }),
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!namespaceId) {
        throw new Error("namespaceId is required");
      }

      if (catalogIds.length === 0) {
        throw new Error("catalogIds is required");
      }

      const catalogsFiles: CatalogFiles[] = [];

      const client = getInstillCatalogAPIClient({ accessToken });

      const catalogs = await client.catalog.listNamespaceCatalogs({
        namespaceId,
      });

      for (const catalogId of catalogIds) {
        if (catalogId.startsWith("temp-")) {
          const res = await client.catalog.listNamespaceCatalogFiles({
            namespaceId,
            catalogId,
          });

          const catalogFile: TempCatalogFiles = {
            files: res,
            isTemp: true,
            catalogId,
          };

          catalogsFiles.push(catalogFile);
          continue;
        }

        const targetCatalog = catalogs.catalogs.find(
          (catalog) => catalog.catalogId === catalogId,
        );

        if (!targetCatalog) {
          continue;
        }

        const res = await client.catalog.listNamespaceCatalogFiles({
          namespaceId,
          catalogId,
        });

        const catalogFile: PersistentCatalogFiles = {
          files: res,
          isTemp: false,
          ...targetCatalog,
        };

        catalogsFiles.push(catalogFile);
      }

      return Promise.resolve(catalogsFiles);
    },
    enabled:
      enabled &&
      Boolean(namespaceId) &&
      Boolean(accessToken) &&
      catalogIds.length > 0,
  });
}
