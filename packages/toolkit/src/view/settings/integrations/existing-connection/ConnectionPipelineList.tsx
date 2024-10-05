"use client";

import type { Nullable } from "instill-sdk";
import * as React from "react";
import Link from "next/link";

import type { InstillStore } from "../../../../lib";
import {
  useInfiniteConnectionPipelines,
  useInstillStore,
  useShallow,
} from "../../../../lib";

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
    const result: string[] = [];

    if (!relatedPipelineIds.isSuccess) {
      return result;
    }

    for (const page of relatedPipelineIds.data.pages) {
      for (const id of page.pipelineIds) {
        result.push(id);
      }
    }
    return result;
  }, [relatedPipelineIds.isSuccess, relatedPipelineIds.data]);

  React.useEffect(() => {
    if (!relatedPipelineIds.isSuccess) {
      return;
    }

    if (
      relatedPipelineIds.data.pages[relatedPipelineIds.data.pages.length - 1]
        ?.nextPageToken
    ) {
      relatedPipelineIds.fetchNextPage();
    }
  }, [
    relatedPipelineIds.isSuccess,
    relatedPipelineIds.data,
    relatedPipelineIds,
  ]);

  if (!pipelineIds.length) {
    return null;
  }

  return (
    <div className="flex flex-row">
      <div className="w-32 text-semantic-fg-disabled text-sm font-normal">
        Pipelines:
      </div>
      <div className="text-sm font-normal flex flex-col [&>a]:text-semantic-accent-default [&>a:hover]:underline flex-1 bg-semantic-bg-alt-primary border border-semantic-bg-line rounded p-2">
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
