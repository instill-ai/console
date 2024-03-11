import {
  Nullable,
  QueryClient,
  checkNamespace,
  prefetchOrganization,
  prefetchUser,
} from "../../../lib";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Header } from "./Header";

export const HeaderSSR = async ({
  entity,
  accessToken,
  queryClient,
}: {
  entity: string;
  accessToken: Nullable<string>;
  queryClient: QueryClient;
}) => {
  const type = await checkNamespace({
    id: entity,
    accessToken,
  });

  switch (type) {
    case "NAMESPACE_ORGANIZATION": {
      await prefetchOrganization({
        organizationID: entity,
        accessToken,
        queryClient,
      });
      break;
    }
    case "NAMESPACE_USER": {
      await prefetchUser({
        userName: entity,
        accessToken,
        queryClient,
      });
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Header />
    </HydrationBoundary>
  );
};
