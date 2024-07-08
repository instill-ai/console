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
  useInstillStore,
  useNamespacePipeline,
  useQueryClient,
  useRouteInfo,
  useShallow,
} from "../../../lib";
import { PipelineTabNames } from "../../../server";
import { useSortedReleases } from "../../pipeline-builder";
import { Head } from "./Head";
import { PipelineContentViewer } from "./PipelineContentViewer";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const ViewPipeline = () => {
  const { tab } = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const shareCode = searchParams.get("view");
  const activeVersion = searchParams.get("version");
  const queryClient = useQueryClient();
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const router = useRouter();

  const routeInfo = useRouteInfo();

  const pipeline = useNamespacePipeline({
    namespacePipelineName: routeInfo.isSuccess
      ? routeInfo.data.pipelineName
      : null,
    enabled: enabledQuery && routeInfo.isSuccess,
    shareCode: shareCode ?? undefined,
    accessToken,
  });

  const releases = useSortedReleases({
    pipelineName: routeInfo.isSuccess ? routeInfo.data.pipelineName : null,
    enabledQuery: enabledQuery && routeInfo.isSuccess,
    accessToken,
  });

  const updateActiveVersionUrl = (version: string) => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("version", version);

    const combinedSearchParams = new URLSearchParams({
      ...Object.fromEntries(searchParams),
      ...Object.fromEntries(newSearchParams),
    });

    router.replace(`${pathname}?${combinedSearchParams.toString()}`);
  };

  React.useEffect(() => {
    if (
      releases.length === 0 ||
      !releases[0] ||
      (activeVersion && releases.find((item) => item.id === activeVersion))
    ) {
      return;
    }

    updateActiveVersionUrl(releases[0].id);
  }, [releases, activeVersion, pathname]);

  React.useEffect(() => {
    if (pipeline.isError) {
      router.push("/404");
    }
  }, [pipeline.isError, router]);

  const activeRelease = React.useMemo(() => {
    if (
      !pipeline.isSuccess ||
      !activeVersion ||
      pipeline.data.releases.length === 0
    ) {
      return null;
    }

    const release = pipeline.data.releases.find(
      (release) => release.id === activeVersion,
    );

    return release || null;
  }, [pipeline.isSuccess, pipeline.data, activeVersion]);

  const setSelectedTab = (tabName: PipelineTabNames) => {
    const currentSearchparams = searchParams.toString();

    router.replace(
      `/${routeInfo.data.namespaceId}/pipelines/${pipeline.data?.id}/${tabName}${currentSearchparams ? `?${currentSearchparams}` : ""}`,
    );
  };

  const onPipelineUpdate = () => {
    pipeline.refetch();

    // Invalidate default models list to have up to date data
    if (routeInfo.isSuccess) {
      queryClient.invalidateQueries({
        queryKey: ["pipelines", routeInfo.data.namespaceName, "infinite"],
      });
    }
  };

  return (
    <React.Fragment>
      <div className="flex flex-col px-12">
        <Head
          onActiveVersionUpdate={updateActiveVersionUrl}
          releases={releases}
          pipeline={pipeline.data}
          isReady={pipeline.isSuccess}
          selectedTab={tab as PipelineTabNames}
          onTabChange={setSelectedTab}
        />
        <PipelineContentViewer
          selectedTab={tab as PipelineTabNames}
          pipeline={pipeline.data}
          onUpdate={onPipelineUpdate}
          activeRelease={activeRelease}
        />
      </div>
    </React.Fragment>
  );
};
