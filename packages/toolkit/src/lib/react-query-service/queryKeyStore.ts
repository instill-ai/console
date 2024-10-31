import { Nullable, ResourceView, Visibility } from "instill-sdk";

import { env } from "../../server";

export const modelQueryKeyStore = {
  getUseInfiniteModelsQueryKey({
    filter,
    visibility,
    orderBy,
    view,
  }: {
    filter: Nullable<string>;
    visibility: Nullable<string>;
    orderBy: Nullable<string>;
    view: Nullable<ResourceView>;
  }) {
    const queryKey = ["models", "infinite"];

    if (filter) {
      queryKey.push(filter);
    }

    if (visibility) {
      queryKey.push(visibility);
    }

    if (orderBy) {
      queryKey.push(orderBy);
    }

    if (view) {
      queryKey.push(view);
    }

    return queryKey;
  },
  getUseInfiniteNamespaceModelsQueryKey(
    namespaceId: Nullable<string>,
    filter: Nullable<string>,
    visibility: Nullable<string>,
    orderBy: Nullable<string>,
    view: Nullable<ResourceView>,
  ) {
    const queryKey = [namespaceId, "models", "infinite"];

    if (filter) {
      queryKey.push(filter);
    }

    if (visibility) {
      queryKey.push(visibility);
    }

    if (orderBy) {
      queryKey.push(orderBy);
    }

    if (view) {
      queryKey.push(view);
    }

    return queryKey;
  },
  getUseInfiniteNamespaceModelVersionsQueryKey({
    namespaceId,
    modelId,
  }: {
    namespaceId: Nullable<string>;
    modelId: Nullable<string>;
  }) {
    return [namespaceId, "models", modelId, "versions", "infinite"];
  },
  getUseNamespaceModelOperationResultQueryKey({
    namespaceId,
    modelId,
    requesterUid,
    view,
  }: {
    namespaceId: Nullable<string>;
    modelId: Nullable<string>;
    requesterUid: Nullable<string>;
    view: Nullable<ResourceView>;
  }) {
    const queryKey = [namespaceId, "models", modelId, "operation"];

    if (requesterUid) {
      queryKey.push(requesterUid);
    }

    if (view) {
      queryKey.push(view);
    }

    return queryKey;
  },
  getUseNamespaceModelVersionOperationResultQueryKey({
    namespaceId,
    modelId,
    versionId,
    requesterUid,
    view,
  }: {
    namespaceId: Nullable<string>;
    modelId: Nullable<string>;
    versionId: Nullable<string>;
    requesterUid: Nullable<string>;
    view: Nullable<ResourceView>;
  }) {
    const queryKey = [
      namespaceId,
      "models",
      modelId,
      "versions",
      versionId,
      "operation",
    ];

    if (requesterUid) {
      queryKey.push(requesterUid);
    }

    if (view) {
      queryKey.push(view);
    }

    return queryKey;
  },
  getUseModelAvailableRegionsQueryKey() {
    return ["models", "available-regions"];
  },
  getNamespaceModelRunsQueryKey({
    namespaceId,
    modelId,
    requesterUid,
    accessToken,
    view,
    pageSize,
    page,
    orderBy,
    filter,
  }: {
    namespaceId: Nullable<string>;
    modelId: Nullable<string>;
    requesterUid: Nullable<string>;
    accessToken: Nullable<string>;
    view: Nullable<ResourceView>;
    pageSize: Nullable<number>;
    page: Nullable<number>;
    orderBy: Nullable<string>;
    filter: Nullable<string>;
  }) {
    const queryKey = [namespaceId, "models", modelId, "runs", "paginated"];

    if (requesterUid) {
      queryKey.push(requesterUid);
    }

    if (accessToken) {
      queryKey.push("withAuth");
    } else {
      queryKey.push("unAuth");
    }

    if (view) {
      queryKey.push(view);
    }

    if (pageSize) {
      queryKey.push(pageSize.toString());
    }

    if (page) {
      queryKey.push(page.toString());
    } else {
      queryKey.push("0");
    }

    if (orderBy) {
      queryKey.push(orderBy);
    }

    if (filter) {
      queryKey.push(filter);
    }

    return queryKey;
  },
  getNamespaceModelsQueryKey({
    namespaceId,
    filter,
    visibility,
  }: {
    namespaceId: Nullable<string>;
    filter: Nullable<string>;
    visibility: Nullable<Visibility>;
  }) {
    const queryKey = [namespaceId, "models"];

    if (filter) {
      queryKey.push(filter);
    }

    if (visibility) {
      queryKey.push(visibility);
    }

    return queryKey;
  },
  getUseWatchNamespaceModelsQueryKey({
    namespaceId,
    modelIds,
  }: {
    namespaceId: Nullable<string>;
    modelIds: string[];
  }) {
    return [namespaceId, "models", modelIds, "watch"];
  },
};

export const pipelineQueryKeyStore = {
  getUseNamespacePipelineQueryKey({
    namespaceId,
    pipelineId,
  }: {
    namespaceId: Nullable<string>;
    pipelineId: Nullable<string>;
  }) {
    return [namespaceId, "pipelines", pipelineId];
  },
  getUseNamespacePipelinesQueryKey({
    namespaceId,
    view,
    filter,
    visibility,
  }: {
    namespaceId: Nullable<string>;
    view: Nullable<ResourceView>;
    filter: Nullable<string>;
    visibility: Nullable<Visibility>;
  }) {
    const queryKey = [namespaceId, "pipelines"];

    if (view) {
      queryKey.push(view);
    }

    if (filter) {
      queryKey.push(filter);
    }

    if (visibility) {
      queryKey.push(visibility);
    }

    return queryKey;
  },
  getUsePaginatedNamespacePipelineRunsQueryKey({
    namespaceId,
    pipelineId,
    requesterUid,
    accessToken,
    view,
    pageSize,
    page,
    orderBy,
    filter,
  }: {
    namespaceId: Nullable<string>;
    pipelineId: Nullable<string>;
    requesterUid: Nullable<string>;
    accessToken: Nullable<string>;
    view: Nullable<ResourceView>;
    pageSize: Nullable<number>;
    page: Nullable<number>;
    orderBy: Nullable<string>;
    filter: Nullable<string>;
  }) {
    const queryKey = [
      namespaceId,
      "pipelines",
      pipelineId,
      "runs",
      "paginated",
      accessToken ? "withAuth" : "unAuth",
    ];

    if (orderBy) {
      queryKey.push(orderBy);
    }

    if (view) {
      queryKey.push(view);
    } else {
      queryKey.push("VIEW_BASIC");
    }

    if (filter) {
      queryKey.push(filter);
    }

    if (requesterUid) {
      queryKey.push(requesterUid);
    }

    if (pageSize) {
      queryKey.push(String(pageSize));
    } else {
      queryKey.push(String(env("NEXT_PUBLIC_QUERY_PAGE_SIZE")));
    }

    if (page) {
      queryKey.push(String(page));
    }

    return queryKey;
  },

  getUseInfiniteNamespacePipelinesQueryKey({
    namespaceId,
    filter,
    visibility,
    view,
  }: {
    namespaceId: Nullable<string>;
    filter: Nullable<string>;
    visibility: Nullable<Visibility>;
    view: Nullable<ResourceView>;
  }) {
    const queryKey = [namespaceId, "pipelines", "infinite"];

    if (filter) {
      queryKey.push(filter);
    }

    if (visibility) {
      queryKey.push(visibility);
    }

    if (view) {
      queryKey.push(view);
    }

    return queryKey;
  },
  getUseInfiniteAccessiblePipelinesQueryKey({
    filter,
    visibility,
    view,
    orderBy,
  }: {
    filter: Nullable<string>;
    visibility: Nullable<Visibility>;
    view: Nullable<ResourceView>;
    orderBy: Nullable<string>;
  }) {
    const queryKey = ["accessible-pipelines", "infinite"];

    if (filter) {
      queryKey.push(filter);
    }

    if (visibility) {
      queryKey.push(visibility);
    }

    if (view) {
      queryKey.push(view);
    }

    if (orderBy) {
      queryKey.push(orderBy);
    }

    return queryKey;
  },
};

export const secretQueryKeyStore = {
  getUseNamespaceSecretQueryKey({
    namespaceId,
    secretId,
  }: {
    namespaceId: Nullable<string>;
    secretId: Nullable<string>;
  }) {
    return [namespaceId, "secrets", secretId];
  },
  getUseNamespaceSecretsQueryKey({
    namespaceId,
  }: {
    namespaceId: Nullable<string>;
  }) {
    return [namespaceId, "secrets"];
  },
};

export const releaseQueryKeyStore = {
  getUseInfiniteNamespacePipelineReleasesQueryKey({
    namespaceId,
    pipelineId,
    view,
    shareCode,
  }: {
    namespaceId: Nullable<string>;
    pipelineId: Nullable<string>;
    view: Nullable<ResourceView>;
    shareCode: Nullable<string>;
  }) {
    const queryKey = [
      namespaceId,
      "pipelines",
      pipelineId,
      "releases",
      "infinite",
    ];

    if (view) {
      queryKey.push(view);
    }

    if (shareCode) {
      queryKey.push(shareCode);
    }

    return queryKey;
  },
  getUseNamespacePipelineReleasesQueryKey({
    namespaceId,
    pipelineId,
    view,
    shareCode,
  }: {
    namespaceId: Nullable<string>;
    pipelineId: Nullable<string>;
    view: Nullable<ResourceView>;
    shareCode: Nullable<string>;
  }) {
    const queryKey = [namespaceId, "pipelines", pipelineId, "releases"];

    if (view) {
      queryKey.push(view);
    }

    if (shareCode) {
      queryKey.push(shareCode);
    }

    return queryKey;
  },
  getUsePaginatedNamepsacePipelineComponentRunsQueryKey({
    pipelineRunId,
    accessToken,
    view,
    orderBy,
    filter,
    requesterUid,
    pageSize,
  }: {
    pipelineRunId: Nullable<string>;
    accessToken: Nullable<string>;
    view: Nullable<ResourceView>;
    orderBy: Nullable<string>;
    filter: Nullable<string>;
    requesterUid: Nullable<string>;
    pageSize: Nullable<number>;
  }) {
    const queryKey = [
      "pipeline-runs",
      pipelineRunId,
      "component-runs",
      "paginated",
      accessToken ? "withAuth" : "unAuth",
    ];

    if (view) {
      queryKey.push(view);
    } else {
      queryKey.push("VIEW_BASIC");
    }

    if (orderBy) {
      queryKey.push(orderBy);
    }

    if (filter) {
      queryKey.push(filter);
    }

    if (requesterUid) {
      queryKey.push(requesterUid);
    }

    if (pageSize) {
      queryKey.push(String(pageSize));
    } else {
      queryKey.push(String(env("NEXT_PUBLIC_QUERY_PAGE_SIZE")));
    }

    return queryKey;
  },
};

export const mgmtQueryKeyStore = {
  getUseUserQueryKey({ userId }: { userId: Nullable<string> }) {
    return ["users", userId];
  },
};

export const queryKeyStore = {
  model: modelQueryKeyStore,
  pipeline: pipelineQueryKeyStore,
  release: releaseQueryKeyStore,
  secret: secretQueryKeyStore,
  mgmt: mgmtQueryKeyStore,
};
