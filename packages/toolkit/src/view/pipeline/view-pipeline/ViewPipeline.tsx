"use client";

import * as React from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  InstillStore,
  Nullable,
  useInstillStore,
  useNamespacePipeline,
  useQueryClient,
  useRouteInfo,
  useShallow,
  useSortedReleases,
} from "../../../lib";
import { PipelineTabNames } from "../../../server";
import { Head } from "./Head";
import { PipelineContentViewer } from "./PipelineContentViewer";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const ViewPipeline = () => {
  const { path } = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const shareCode = searchParams.get("view");
  const activeVersion = searchParams.get("version");
  const queryClient = useQueryClient();
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const router = useRouter();
  const routeInfo = useRouteInfo();

  const pipeline = useNamespacePipeline({
    namespaceId: routeInfo.data.namespaceId,
    pipelineId: routeInfo.data.resourceId,
    enabled: enabledQuery && routeInfo.isSuccess,
    shareCode,
    view: "VIEW_FULL",
    accessToken,
  });

  const releases = useSortedReleases({
    namespaceId: routeInfo.isSuccess ? routeInfo.data.namespaceId : null,
    pipelineId: routeInfo.isSuccess ? routeInfo.data.resourceId : null,
    enabledQuery: enabledQuery && routeInfo.isSuccess,
    shareCode,
    accessToken,
    view: "VIEW_FULL",
  });

  React.useEffect(() => {
    if (pipeline.isError) {
      router.push("/404");
    }
  }, [pipeline.isError, router]);

  const updateActiveVersionUrl = (version: Nullable<string>) => {
    if (version === null) {
      router.replace(pathname);

      return;
    }

    const newSearchParams = new URLSearchParams();
    newSearchParams.set("version", version);

    const combinedSearchParams = new URLSearchParams({
      ...Object.fromEntries(searchParams),
      ...Object.fromEntries(newSearchParams),
    });

    router.replace(`${pathname}?${combinedSearchParams.toString()}`);
  };

  React.useEffect(() => {
    if (releases.isSuccess) {
      if (activeVersion) {
        if (releases.data.length > 0) {
          if (
            !releases.data.find((item) => item.id === activeVersion) &&
            releases.data[0]
          ) {
            updateActiveVersionUrl(releases.data[0].id);
          }
        } else {
          updateActiveVersionUrl(null);
        }
      } else if (releases.data[0]) {
        updateActiveVersionUrl(releases.data[0].id);
      }
    }
  }, [releases.isSuccess, releases.data, activeVersion, pathname]);

  const setSelectedTab = (tabName: PipelineTabNames) => {
    const currentSearchparams = searchParams.toString();

    router.replace(
      `/${routeInfo.data.namespaceId}/pipelines/${pipeline.data?.id}/${tabName}${currentSearchparams ? `?${currentSearchparams}` : ""}`,
    );
  };

  const onPipelineUpdate = () => {
    pipeline.refetch();

    // Invalidate default pipelines list to have up to date data
    if (routeInfo.isSuccess) {
      queryClient.invalidateQueries({
        queryKey: ["pipelines", routeInfo.data.namespaceName, "infinite"],
      });
    }
  };

  const isReady =
    pipeline.isSuccess && releases.isSuccess && !releases.isFetchingNextPage;

  return (
    <React.Fragment>
      <div className="flex flex-col min-h-full">
        <Head
          onActiveVersionUpdate={updateActiveVersionUrl}
          releases={releases.data}
          pipeline={pipeline.data}
          isReady={isReady}
          selectedTab={path?.[0] as PipelineTabNames}
          onTabChange={setSelectedTab}
        />
        <PipelineContentViewer
          selectedTab={path?.[0] as PipelineTabNames}
          pipeline={pipeline.data}
          onUpdate={onPipelineUpdate}
          releases={releases.data}
          isReady={isReady}
        />
      </div>
    </React.Fragment>
  );
};
