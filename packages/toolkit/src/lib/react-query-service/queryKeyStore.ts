import { Nullable, ResourceView, Visibility } from "instill-sdk";

export const modelQueryKeyStore = {
  getUseInfiniteModelsQueryKey({
    filter,
    visibility,
    orderBy,
  }: {
    filter: Nullable<string>;
    visibility: Nullable<string>;
    orderBy: Nullable<string>;
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

    return queryKey;
  },
  getUseInfiniteNamespaceModelsQueryKey(
    namespaceId: Nullable<string>,
    filter: Nullable<string>,
    visibility: Nullable<string>,
    orderBy: Nullable<string>,
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

export const queryKeyStore = {
  model: modelQueryKeyStore,
};
