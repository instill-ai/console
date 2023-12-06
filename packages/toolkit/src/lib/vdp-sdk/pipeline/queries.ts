import { Nullable } from "../../type";
import { createInstillAxiosClient, getQueryString } from "../helper";
import {
  OperatorDefinition,
  Pipeline,
  PipelineRelease,
  PipelineReleaseWatchState,
} from "./types";

export type ListPipelinesResponse = {
  pipelines: Pipeline[];
  next_page_token: string;
  total_size: number;
};

export async function listPipelinesQuery({
  pageSize,
  nextPageToken,
  accessToken,
  enablePagination,
}: {
  pageSize: Nullable<number>;
  nextPageToken: Nullable<string>;
  accessToken: Nullable<string>;
  enablePagination?: boolean;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "vdp");
    const pipelines: Pipeline[] = [];

    const queryString = getQueryString({
      baseURL: "/pipelines?view=VIEW_FULL",
      pageSize,
      nextPageToken,
      filter: null,
    });

    const { data } = await client.get<ListPipelinesResponse>(queryString);

    if (enablePagination) {
      return Promise.resolve(data);
    }

    pipelines.push(...data.pipelines);

    if (data.next_page_token) {
      pipelines.push(
        ...((await listPipelinesQuery({
          pageSize,
          nextPageToken: data.next_page_token,
          accessToken,
          enablePagination,
        })) as Pipeline[])
      );
    }

    return Promise.resolve(pipelines);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type ListUserPipelinesResponse = {
  pipelines: Pipeline[];
  next_page_token: string;
  total_size: number;
};

export type listUserPipelinesQueryParams = {
  pageSize: Nullable<number>;
  nextPageToken: Nullable<string>;
  accessToken: Nullable<string>;
  userName: string;
};

export function listUserPipelinesQuery(
  props: listUserPipelinesQueryParams & {
    enablePagination: true;
  }
): Promise<ListUserPipelinesResponse>;
export function listUserPipelinesQuery(
  props: listUserPipelinesQueryParams & {
    enablePagination: false;
  }
): Promise<Pipeline[]>;
export function listUserPipelinesQuery(
  props: listUserPipelinesQueryParams & {
    enablePagination: undefined;
  }
): Promise<Pipeline[]>;
export async function listUserPipelinesQuery(
  props: listUserPipelinesQueryParams & {
    enablePagination?: boolean;
  }
) {
  const { pageSize, nextPageToken, accessToken, userName, enablePagination } =
    props;
  try {
    const client = createInstillAxiosClient(accessToken, "vdp");
    const pipelines: Pipeline[] = [];

    const queryString = getQueryString({
      baseURL: `${userName}/pipelines?view=VIEW_FULL`,
      pageSize,
      nextPageToken,
      filter: null,
    });

    const { data } = await client.get<ListUserPipelinesResponse>(queryString);

    if (enablePagination) {
      return Promise.resolve(data);
    }

    pipelines.push(...data.pipelines);

    if (data.next_page_token) {
      pipelines.push(
        ...(await listUserPipelinesQuery({
          pageSize,
          nextPageToken: data.next_page_token,
          accessToken,
          userName,
          enablePagination: false,
        }))
      );
    }

    return Promise.resolve(pipelines);
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
    const client = createInstillAxiosClient(accessToken, "vdp");

    const { data } = await client.get<GetUserPipelineResponse>(
      `/${pipelineName}?view=VIEW_FULL`,
      {
        headers: {
          "instill-share-code": shareCode,
          "Access-Control-Allow-Headers": shareCode
            ? "instill-share-code"
            : undefined,
          "Content-Type": "application/json",
        },
      }
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
  next_page_token: string;
  total_size: number;
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
    const client = createInstillAxiosClient(accessToken, "vdp");
    const releases: PipelineRelease[] = [];

    const queryString = getQueryString({
      baseURL: `/${pipelineName}/releases?view=VIEW_FULL`,
      pageSize,
      nextPageToken,
      filter: null,
    });

    const { data } = await client.get<ListPipelineReleasesResponse>(
      queryString,
      {
        headers: {
          "instill-share-code": shareCode,
          "Access-Control-Allow-Headers": shareCode
            ? "instill-share-code"
            : undefined,
          "Content-Type": "application/json",
        },
      }
    );

    releases.push(...data.releases);

    if (data.next_page_token) {
      releases.push(
        ...(await ListUserPipelineReleasesQuery({
          pipelineName,
          pageSize,
          nextPageToken: data.next_page_token,
          accessToken,
          shareCode,
        }))
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
    const client = createInstillAxiosClient(accessToken, "vdp");

    const { data } = await client.get<GetUserPipelineReleaseResponse>(
      `/${pipelineReleaseName}?view=VIEW_FULL`
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
    const client = createInstillAxiosClient(accessToken, "vdp");
    const { data } = await client.get<WatchUserPipelineReleaseResponse>(
      `/${pipelineReleaseName}/watch`
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
  operator_definitions: OperatorDefinition[];
  next_page_token: string;
  total_size: number;
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
    const client = createInstillAxiosClient(accessToken, "vdp");
    const operatorDefinitions: OperatorDefinition[] = [];

    const queryString = getQueryString({
      baseURL: `/operator-definitions?view=VIEW_FULL`,
      pageSize,
      nextPageToken,
      filter,
    });

    const { data } =
      await client.get<ListOperatorDefinitionsResponse>(queryString);

    operatorDefinitions.push(...data.operator_definitions);

    if (data.next_page_token) {
      operatorDefinitions.push(
        ...(await listOperatorDefinitionsQuery({
          pageSize,
          accessToken,
          nextPageToken: data.next_page_token,
          filter,
        }))
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
    const client = createInstillAxiosClient(accessToken, "vdp");

    const { data } = await client.get<GetOperatorDefinitionResponse>(
      `/${operatorDefinitionName}?view=VIEW_FULL`
    );

    return Promise.resolve(data.operator_definition);
  } catch (err) {
    return Promise.reject(err);
  }
}
