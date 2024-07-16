import { Nullable } from "../../type";
import {
  createInstillAxiosClient,
  getInstillAdditionalHeaders,
  getQueryString,
} from "../helper";
import { Visibility } from "../types";
import {
  OperatorDefinition,
  Pipeline,
  PipelineRelease,
  PipelineReleaseWatchState,
  Secret,
} from "./types";

export type ListPipelinesResponse = {
  pipelines: Pipeline[];
  nextPageToken: string;
  totalSize: number;
};

export type listPipelinesQueryParams = {
  pageSize: Nullable<number>;
  nextPageToken: Nullable<string>;
  accessToken: Nullable<string>;
  visibility: Nullable<Visibility>;
  filter: Nullable<string>;
  orderBy?: Nullable<string>;
  disabledViewFull?: boolean;
};

export async function listPipelinesQuery(
  props: listPipelinesQueryParams & {
    enablePagination: true;
  },
): Promise<ListPipelinesResponse>;
export async function listPipelinesQuery(
  props: listPipelinesQueryParams & {
    enablePagination: false;
  },
): Promise<Pipeline[]>;
export async function listPipelinesQuery(
  props: listPipelinesQueryParams & {
    enablePagination: undefined;
  },
): Promise<Pipeline[]>;
export async function listPipelinesQuery(
  props: listPipelinesQueryParams & {
    enablePagination?: boolean;
  },
) {
  const {
    pageSize,
    nextPageToken,
    accessToken,
    enablePagination,
    visibility,
    filter,
    orderBy,
    disabledViewFull,
  } = props;

  try {
    const client = createInstillAxiosClient(accessToken);
    const pipelines: Pipeline[] = [];

    const queryString = getQueryString({
      baseURL: disabledViewFull ? "/pipelines" : "/pipelines?view=VIEW_FULL",
      pageSize,
      nextPageToken,
      queryParams: visibility ? `visibility=${visibility}` : undefined,
      filter,
      orderBy,
    });

    const { data } = await client.get<ListPipelinesResponse>(queryString);

    if (enablePagination) {
      return Promise.resolve(data);
    }

    pipelines.push(...data.pipelines);

    if (data.nextPageToken) {
      pipelines.push(
        ...(await listPipelinesQuery({
          pageSize,
          nextPageToken: data.nextPageToken,
          accessToken,
          enablePagination: false,
          filter,
          visibility,
          orderBy,
          disabledViewFull,
        })),
      );
    }

    return Promise.resolve(pipelines);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type ListUserPipelinesResponse = {
  pipelines: Pipeline[];
  nextPageToken: string;
  totalSize: number;
};

export type listUserPipelinesQueryProps = {
  pageSize: Nullable<number>;
  nextPageToken: Nullable<string>;
  accessToken: Nullable<string>;
  userName: string;
  filter: Nullable<string>;
  visibility: Nullable<Visibility>;
  disabledViewFull?: boolean;
};

export async function listUserPipelinesQuery(
  props: listUserPipelinesQueryProps & {
    enablePagination: true;
  },
): Promise<ListUserPipelinesResponse>;
export async function listUserPipelinesQuery(
  props: listUserPipelinesQueryProps & {
    enablePagination: false;
  },
): Promise<Pipeline[]>;
export async function listUserPipelinesQuery(
  props: listUserPipelinesQueryProps & {
    enablePagination: undefined;
  },
): Promise<Pipeline[]>;
export async function listUserPipelinesQuery(
  props: listUserPipelinesQueryProps & {
    enablePagination?: boolean;
  },
) {
  const {
    pageSize,
    nextPageToken,
    accessToken,
    userName,
    enablePagination,
    filter,
    visibility,
    disabledViewFull,
  } = props;
  try {
    const client = createInstillAxiosClient(accessToken);
    const pipelines: Pipeline[] = [];

    const queryString = getQueryString({
      baseURL: disabledViewFull
        ? `${userName}/pipelines`
        : `${userName}/pipelines?view=VIEW_FULL`,
      pageSize,
      nextPageToken,
      queryParams: visibility ? `visibility=${visibility}` : undefined,
      filter,
    });

    const { data } = await client.get<ListUserPipelinesResponse>(queryString);

    if (enablePagination) {
      return Promise.resolve(data);
    }

    pipelines.push(...data.pipelines);

    if (data.nextPageToken) {
      pipelines.push(
        ...(await listUserPipelinesQuery({
          pageSize,
          nextPageToken: data.nextPageToken,
          accessToken,
          userName,
          enablePagination: false,
          filter,
          visibility,
        })),
      );
    }

    return Promise.resolve(pipelines);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type listPipelinesReleasesQueryProps = {
  pipelineName: string;
  accessToken: Nullable<string>;
  shareCode?: string;
  nextPageToken: Nullable<string>;
  pageSize: Nullable<number>;
  disabledViewFull?: boolean;
};

export async function listPipelinesReleasesQuery(
  props: listPipelinesReleasesQueryProps & {
    enablePagination: true;
  },
): Promise<ListPipelineReleasesResponse>;
export async function listPipelinesReleasesQuery(
  props: listPipelinesReleasesQueryProps & {
    enablePagination: false;
  },
): Promise<PipelineRelease[]>;
export async function listPipelinesReleasesQuery(
  props: listPipelinesReleasesQueryProps & {
    enablePagination: undefined;
  },
): Promise<PipelineRelease[]>;
export async function listPipelinesReleasesQuery(
  props: listPipelinesReleasesQueryProps & {
    enablePagination?: boolean;
  },
) {
  const {
    pageSize,
    nextPageToken,
    accessToken,
    pipelineName,
    enablePagination,
    disabledViewFull,
    shareCode,
  } = props;
  try {
    const client = createInstillAxiosClient(accessToken);
    const releases: PipelineRelease[] = [];

    const queryString = getQueryString({
      baseURL: disabledViewFull
        ? `${pipelineName}/releases`
        : `${pipelineName}/releases?view=VIEW_FULL`,
      pageSize,
      nextPageToken,
    });

    const additionalHeaders = getInstillAdditionalHeaders({
      shareCode,
    });

    const { data } = await client.get<ListPipelineReleasesResponse>(
      queryString,
      {
        headers: {
          "Content-Type": "application/json",
          ...additionalHeaders,
        },
      },
    );

    if (enablePagination) {
      return Promise.resolve(data);
    }

    releases.push(...data.releases);

    if (data.nextPageToken) {
      releases.push(
        ...(await listPipelinesReleasesQuery({
          pageSize,
          nextPageToken: data.nextPageToken,
          accessToken,
          pipelineName,
          enablePagination: false,
          shareCode,
          disabledViewFull,
        })),
      );
    }

    return Promise.resolve(releases);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type GetUserPipelineResponse = {
  pipeline: Pipeline;
};

export async function getUserPipelineQuery({
  pipelineName,
  accessToken,
  shareCode,
}: {
  pipelineName: string;
  accessToken: Nullable<string>;
  shareCode?: string;
}) {
  try {
    const client = createInstillAxiosClient(accessToken);

    const additionalHeaders = getInstillAdditionalHeaders({
      shareCode,
    });

    const { data } = await client.get<GetUserPipelineResponse>(
      `/${pipelineName}?view=VIEW_FULL`,
      {
        headers: {
          "Content-Type": "application/json",
          ...additionalHeaders,
        },
      },
    );

    return Promise.resolve(data.pipeline);
  } catch (err) {
    return Promise.reject(err);
  }
}

/* -------------------------------------------------------------------------
 * Pipeline Release
 * -----------------------------------------------------------------------*/

export type ListPipelineReleasesResponse = {
  releases: PipelineRelease[];
  nextPageToken: string;
  totalSize: number;
};

export async function ListUserPipelineReleasesQuery({
  pipelineName,
  pageSize,
  nextPageToken,
  accessToken,
  shareCode,
}: {
  pipelineName: string;
  pageSize: Nullable<number>;
  nextPageToken: Nullable<string>;
  accessToken: Nullable<string>;
  shareCode?: string;
}) {
  try {
    const client = createInstillAxiosClient(accessToken);
    const releases: PipelineRelease[] = [];

    const queryString = getQueryString({
      baseURL: `/${pipelineName}/releases?view=VIEW_FULL`,
      pageSize,
      nextPageToken,
      filter: null,
    });

    const additionalHeaders = getInstillAdditionalHeaders({
      shareCode,
    });

    const { data } = await client.get<ListPipelineReleasesResponse>(
      queryString,
      {
        headers: {
          "Content-Type": "application/json",
          ...additionalHeaders,
        },
      },
    );

    releases.push(...data.releases);

    if (data.nextPageToken) {
      releases.push(
        ...(await ListUserPipelineReleasesQuery({
          pipelineName,
          pageSize,
          nextPageToken: data.nextPageToken,
          accessToken,
          shareCode,
        })),
      );
    }

    return Promise.resolve(releases);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type GetUserPipelineReleaseResponse = {
  release: PipelineRelease;
};

export async function getUserPipelineReleaseQuery({
  pipelineReleaseName,
  accessToken,
}: {
  pipelineReleaseName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken);

    const { data } = await client.get<GetUserPipelineReleaseResponse>(
      `/${pipelineReleaseName}?view=VIEW_FULL`,
    );

    return Promise.resolve(data.release);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type WatchUserPipelineReleaseResponse = {
  state: PipelineReleaseWatchState;
};

export async function watchUserPipelineReleaseQuery({
  pipelineReleaseName,
  accessToken,
}: {
  pipelineReleaseName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken);
    const { data } = await client.get<WatchUserPipelineReleaseResponse>(
      `/${pipelineReleaseName}/watch`,
    );
    return Promise.resolve(data.state);
  } catch (err) {
    return Promise.reject(err);
  }
}

/* -------------------------------------------------------------------------
 * Operator
 * -----------------------------------------------------------------------*/

export type ListOperatorDefinitionsResponse = {
  operatorDefinitions: OperatorDefinition[];
  nextPageToken: string;
  totalSize: number;
};

export async function listOperatorDefinitionsQuery({
  pageSize,
  nextPageToken,
  accessToken,
  filter,
}: {
  pageSize: Nullable<number>;
  nextPageToken: Nullable<string>;
  accessToken: Nullable<string>;
  filter: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken);
    const operatorDefinitions: OperatorDefinition[] = [];

    const queryString = getQueryString({
      baseURL: `/operator-definitions?view=VIEW_FULL`,
      pageSize,
      nextPageToken,
      filter,
    });

    const { data } =
      await client.get<ListOperatorDefinitionsResponse>(queryString);

    operatorDefinitions.push(...data.operatorDefinitions);

    if (data.nextPageToken) {
      operatorDefinitions.push(
        ...(await listOperatorDefinitionsQuery({
          pageSize,
          accessToken,
          nextPageToken: data.nextPageToken,
          filter,
        })),
      );
    }

    return Promise.resolve(operatorDefinitions);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type GetOperatorDefinitionResponse = {
  operator_definition: OperatorDefinition;
};

export async function getOperatorDefinitionQuery({
  operatorDefinitionName,
  accessToken,
}: {
  operatorDefinitionName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken);

    const { data } = await client.get<GetOperatorDefinitionResponse>(
      `/${operatorDefinitionName}?view=VIEW_FULL`,
    );

    return Promise.resolve(data.operator_definition);
  } catch (err) {
    return Promise.reject(err);
  }
}

/* -------------------------------------------------------------------------
 * Secret
 * -----------------------------------------------------------------------*/

export type GetSecretResponse = {
  secret: Secret;
};

export async function getUserSecretQuery({
  secretName,
  accessToken,
}: {
  secretName: Nullable<string>;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken);

    const { data } = await client.get<GetSecretResponse>(`/${secretName}`);

    return Promise.resolve(data.secret);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type ListUserSecretResponse = {
  secrets: Secret[];
  nextPageToken: string;
  totalSize: number;
};

export async function listUserSecretsQuery({
  entityName,
  pageSize,
  nextPageToken,
  accessToken,
}: {
  entityName: Nullable<string>;
  pageSize: Nullable<number>;
  nextPageToken: Nullable<string>;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken);
    const secrets: Secret[] = [];

    const queryString = getQueryString({
      baseURL: `/${entityName}/secrets`,
      pageSize,
      nextPageToken,
    });

    const { data } = await client.get<ListUserSecretResponse>(queryString);

    secrets.push(...data.secrets);

    if (data.nextPageToken) {
      secrets.push(
        ...(await listUserSecretsQuery({
          entityName,
          pageSize,
          accessToken,
          nextPageToken: data.nextPageToken,
        })),
      );
    }

    return Promise.resolve(secrets);
  } catch (err) {
    return Promise.reject(err);
  }
}
