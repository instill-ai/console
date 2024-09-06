import * as React from "react";
import Link from "next/link";
import { Nullable } from "instill-sdk";

import {
  InstillStore,
  useInfiniteConnectionPipelines,
  useInstillStore,
  useShallow,
} from "../../../lib";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export type ConnectionPipelineListProps = {
  namespaceId: Nullable<string>;
  connectionId: Nullable<string>;
};

export const ConnectionPipelineList = ({
  namespaceId,
  connectionId,
}: ConnectionPipelineListProps) => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const relatedPipelineIds = useInfiniteConnectionPipelines({
    namespaceId,
    connectionId,
    accessToken,
    enabled: enabledQuery,
    filter: null,
  });

  const pipelineIds = React.useMemo(() => {
    return (
      relatedPipelineIds.data?.pages.reduce(
        (acc: string[], page) => acc.concat(page.pipelineIds),
        [],
      ) || []
    );
  }, [relatedPipelineIds.isSuccess, relatedPipelineIds.data]);

  React.useEffect(() => {
    if (relatedPipelineIds.data) {
      if (
        relatedPipelineIds.data.pages[relatedPipelineIds.data.pages.length - 1]
          ?.nextPageToken
      ) {
        relatedPipelineIds.fetchNextPage();
      }
    }
  }, [relatedPipelineIds.isSuccess, relatedPipelineIds.data]);

  if (!pipelineIds.length) {
    return null;
  }

  return (
    <div className="flex flex-row">
      <div className="w-32 text-semantic-fg-disabled text-sm font-normal">
        Pipelines:
      </div>
      <div className="text-sm font-normal flex flex-col [&>a]:text-semantic-accent-default [&>a:hover]:underline">
        {pipelineIds.map((item) => (
          <Link
            target="_blank"
            href={`/${namespaceId}/pipelines/${item}/playground`}
            key={item}
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
};
