import * as React from "react";
import * as semver from "semver";

import {
  Nullable,
  PipelineRelease,
  useInfiniteNamespacePipelineReleases,
} from "../../../../lib";

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
  pipelineName,
  accessToken,
  enabledQuery,
  shareCode,
}: {
  pipelineName: Nullable<string>;
  accessToken: Nullable<string>;
  enabledQuery: boolean;
  shareCode?: string;
}) {
  const pipelineReleases = useInfiniteNamespacePipelineReleases({
    namespacePipelineName: pipelineName,
    enabledQuery,
    accessToken,
    shareCode,
  });

  React.useEffect(() => {
    if (!pipelineReleases.data?.pages.length) {
      return;
    }

    const targetPage =
      pipelineReleases.data.pages[pipelineReleases.data.pages.length - 1];

    if (targetPage && targetPage.nextPageToken) {
      pipelineReleases.fetchNextPage();
    }
  }, [pipelineReleases.isSuccess, pipelineReleases.data]);

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
  }, [pipelineReleases.data, pipelineReleases.isSuccess, pipelineName]);

  return {
    isFetchingNextPage: pipelineReleases.isFetchingNextPage,
    isSuccess: pipelineReleases.isSuccess,
    data: sortedReleases,
  };
}
