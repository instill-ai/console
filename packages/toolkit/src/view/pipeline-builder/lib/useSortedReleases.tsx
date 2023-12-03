import * as React from "react";
import * as semver from "semver";
import { Nullable, useUserPipelineReleases } from "../../../lib";

export function useSortedReleases({
  pipelineName,
  accessToken,
  enabledQuery,
}: {
  pipelineName: Nullable<string>;
  accessToken: Nullable<string>;
  enabledQuery: boolean;
}) {
  const pipelineReleases = useUserPipelineReleases({
    pipelineName,
    enabled: enabledQuery,
    accessToken,
  });

  const sortedReleases = React.useMemo(() => {
    if (!pipelineReleases.isSuccess) {
      return [];
    }

    return pipelineReleases.data.sort((a, b) => {
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

    // When every user change pipelineName we will rerender the pipelineReleases
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [pipelineReleases.data, pipelineReleases.isSuccess, pipelineName]);

  return sortedReleases;
}
