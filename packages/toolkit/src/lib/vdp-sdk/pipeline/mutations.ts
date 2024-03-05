import { GeneralRecord, Nullable } from "../../type";
import { createInstillAxiosClient } from "../helper";
import {
  Pipeline,
  PipelineRecipe,
  PipelineRelease,
  PipelineSharing,
} from "./types";

export type CreateUserPipelinePayload = {
  id: string;
  description?: string;
  recipe: PipelineRecipe;
  metadata: GeneralRecord;
  sharing?: PipelineSharing;
  readme?: string;
};

export type CreatePipelineResponse = {
  pipeline: Pipeline;
};

export async function createUserPipelineMutation({
  entityName,
  payload,
  accessToken,
}: {
  entityName: string;
  payload: CreateUserPipelinePayload;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "vdp");

    const { data } = await client.post<CreatePipelineResponse>(
      `/${entityName}/pipelines`,
      payload
    );
    return Promise.resolve(data.pipeline);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type UpdateUserPipelinePayload = {
  name: string;
  description?: string;
  recipe?: PipelineRecipe;
  sharing?: PipelineSharing;
  metadata?: GeneralRecord;
  readme?: string;
};

export type UpdateUserPipelineResponse = {
  pipeline: Pipeline;
};

export async function updateUserPipelineMutation({
  payload,
  accessToken,
}: {
  payload: UpdateUserPipelinePayload;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "vdp");

    const { data } = await client.patch<UpdateUserPipelineResponse>(
      `/${payload.name}`,
      payload
    );
    return Promise.resolve(data.pipeline);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function deleteUserPipelineMutation({
  pipelineName,
  accessToken,
}: {
  pipelineName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "vdp");

    await client.delete(`/${pipelineName}`);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type RenameUserPipelinePayload = {
  name: string;
  new_pipeline_id: string;
};

export type RenameUserPipelineResponse = {
  pipeline: Pipeline;
};

export async function renameUserPipelineMutation({
  payload,
  accessToken,
}: {
  payload: RenameUserPipelinePayload;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "vdp");

    const { data } = await client.post<RenameUserPipelineResponse>(
      `/${payload.name}/rename`,
      payload
    );

    return Promise.resolve(data.pipeline);
  } catch (err) {
    return Promise.reject(err);
  }
}

/* -------------------------------------------------------------------------
 * Pipeline Release
 * -----------------------------------------------------------------------*/

export type CreateUserPipelineReleasePayload = {
  id: string;
  description?: string;
  recipe: PipelineRecipe;
};

export type CreateUserPipelineReleaseResponse = {
  release: PipelineRelease;
};

export async function createUserPipelineReleaseMutation({
  pipelineName,
  payload,
  accessToken,
}: {
  pipelineName: string;
  payload: CreateUserPipelineReleasePayload;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "vdp");

    const { data } = await client.post<CreateUserPipelineReleaseResponse>(
      `${pipelineName}/releases`,
      payload
    );

    return Promise.resolve(data.release);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type UpdateUserPipelineReleasePayload = {
  description?: string;
  recipe: PipelineRecipe;
};

export type UpdateUserPipelineReleaseResponse = {
  release: PipelineRelease;
};

export async function updateUserPipelineReleaseMutation({
  payload,
  pipelineReleaseName,
  accessToken,
}: {
  payload: UpdateUserPipelineReleasePayload;
  pipelineReleaseName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "vdp");

    const { data } = await client.patch<UpdateUserPipelineReleaseResponse>(
      `/${pipelineReleaseName}`,
      payload
    );
    return Promise.resolve(data.release);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function deleteUserPipelineReleaseMutation({
  pipelineReleaseName,
  accessToken,
}: {
  pipelineReleaseName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "vdp");

    await client.delete(`/${pipelineReleaseName}`);
  } catch (err) {
    return Promise.reject(err);
  }
}
