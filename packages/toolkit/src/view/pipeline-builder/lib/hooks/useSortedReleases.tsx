import * as React from "react";
import * as semver from "semver";
import {
  Nullable,
  PipelineRelease,
  useUserPipelineReleases,
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
  const pipelineReleases = useUserPipelineReleases({
    pipelineName,
    enabled: enabledQuery,
    accessToken,
    shareCode,
  });

  const sortedReleases = React.useMemo(() => {
    if (!pipelineReleases.isSuccess) {
      return [];
    }

    return sortPipelineReleases(pipelineReleases.data);

    // When every user change pipelineName we will rerender the pipelineReleases
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [pipelineReleases.data, pipelineReleases.isSuccess, pipelineName]);

  return sortedReleases;
}
