"use client";

import type { Nullable, PipelineRelease, ResourceView } from "instill-sdk";
import * as React from "react";
import * as semver from "semver";

import { useInfiniteNamespacePipelineReleases } from "./useInfiniteNamespacePipelineReleases";

export function sortPipelineReleases(releases: PipelineRelease[]) {
  return releases.sort((a, b) => {
    // Only the version lack of digit will fall coerce
    // https://github.com/npm/node-semver#coercion
    const aCoerce = semver.coerce(a.id);
    const bCoerce = semver.coerce(b.id);

    if (!aCoerce || !bCoerce) {
      return 0;
    }

    if (semver.gt(aCoerce, bCoerce)) {
      return -1;
    }

    if (semver.lt(aCoerce, bCoerce)) {
      return 1;
    }

    return 0;
  });
}

export function useSortedReleases({
  namespaceId,
  pipelineId,
  accessToken,
  enabledQuery,
  shareCode,
  view,
}: {
  namespaceId: Nullable<string>;
  pipelineId: Nullable<string>;
  accessToken: Nullable<string>;
  enabledQuery: boolean;
  shareCode: Nullable<string>;
  view: Nullable<ResourceView>;
}) {
  const pipelineReleases = useInfiniteNamespacePipelineReleases({
    namespaceId: namespaceId,
    pipelineId: pipelineId,
    enabledQuery,
    accessToken,
    shareCode,
    view,
    pageSize: null,
  });

  React.useEffect(() => {
    if (!pipelineReleases.data?.pages.length) {
      return;
    }

    if (
      pipelineReleases.data.pages[pipelineReleases.data.pages.length - 1]
        ?.nextPageToken
    ) {
      pipelineReleases.fetchNextPage();
    }
  }, [pipelineReleases, pipelineReleases.data]);

  const sortedReleases = React.useMemo(() => {
    if (!pipelineReleases.isSuccess) {
      return [];
    }

    return sortPipelineReleases(
      pipelineReleases.data.pages.reduce(
        (acc: PipelineRelease[], page) => acc.concat(page.releases),
        [],
      ),
    );

    // When every user change pipelineName we will rerender the pipelineReleases
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [
    pipelineReleases.data,
    pipelineReleases.isSuccess,
    namespaceId,
    pipelineId,
  ]);

  return {
    isFetchingNextPage: pipelineReleases.isFetchingNextPage,
    isSuccess: pipelineReleases.isSuccess,
    data: sortedReleases,
  };
}
