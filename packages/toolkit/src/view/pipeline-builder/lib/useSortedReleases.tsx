import * as React from "react";
import * as semver from "semver";
import { Nullable, useUserPipelineReleases } from "../../../lib";

export function useSortedReleases({
  pipelineName,
  accessToken,
  enableQuery,
}: {
  pipelineName: Nullable<string>;
  accessToken: Nullable<string>;
  enableQuery: boolean;
}) {
  const pipelineReleases = useUserPipelineReleases({
    pipelineName,
    enabled: enableQuery,
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
  }, [pipelineReleases.data, pipelineReleases.isSuccess, pipelineName]);

  return sortedReleases;
}
