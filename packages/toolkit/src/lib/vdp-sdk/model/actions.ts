import { Nullable } from "../../type";
import {
  createInstillAxiosClient,
  getInstillAdditionalHeaders,
} from "../helper";
import { Operation } from "../operation/types";
import { ModelTask } from "./types";

export type DeployUserModelResponse = {
  modelId: string;
};

export async function deployUserModelAction({
  modelName,
  accessToken,
}: {
  modelName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, true);

    const { data } = await client.post<DeployUserModelResponse>(
      `/${modelName}/deploy`,
    );
    return Promise.resolve(data.modelId);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type UndeployUserModelResponse = {
  modelId: string;
};

export async function undeployUserModeleAction({
  modelName,
  accessToken,
}: {
  modelName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, true);

    const { data } = await client.post<UndeployUserModelResponse>(
      `/${modelName}/undeploy`,
    );
    return Promise.resolve(data.modelId);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type TriggerUserModelPayload = {
  taskInputs: Record<string, unknown>[];
};

export type TriggerUserModelResponse = {
  task: ModelTask;
  taskOutputs: Record<string, Record<string, unknown>>[];
};

export type TriggerUserModelAsyncResponse = {
  operation: Operation;
};

export async function triggerUserModelAction({
  modelName,
  payload,
  accessToken,
  returnTraces,
  requesterUid,
}: {
  modelName: string;
  payload: TriggerUserModelPayload;
  accessToken: Nullable<string>;
  returnTraces?: boolean;
  requesterUid?: string;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, true);

    const additionalHeaders = getInstillAdditionalHeaders({
      requesterUid,
      returnTraces,
    });

    const { data } = await client.post<TriggerUserModelResponse>(
      `/${modelName}/trigger`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          ...additionalHeaders,
        },
      },
    );
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function triggerUserModelActionAsync({
  modelName,
  payload,
  accessToken,
  returnTraces,
  requesterUid,
}: {
  modelName: string;
  payload: TriggerUserModelPayload;
  accessToken: Nullable<string>;
  returnTraces?: boolean;
  requesterUid?: string;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, true);

    const additionalHeaders = getInstillAdditionalHeaders({
      requesterUid,
      returnTraces,
    });

    const { data } = await client.post<TriggerUserModelAsyncResponse>(
      `/${modelName}/triggerAsync`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          ...additionalHeaders,
        },
      },
    );
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function triggerUserModelVersionActionAsync({
  modelName,
  payload,
  accessToken,
  returnTraces,
  requesterUid,
  versionId,
}: {
  modelName: string;
  payload: TriggerUserModelPayload;
  accessToken: Nullable<string>;
  returnTraces?: boolean;
  requesterUid?: string;
  versionId: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, true);

    const additionalHeaders = getInstillAdditionalHeaders({
      requesterUid,
      returnTraces,
    });

    const { data } = await client.post<TriggerUserModelAsyncResponse>(
      `/${modelName}/versions/${versionId}/triggerAsync`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          ...additionalHeaders,
        },
      },
    );
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
}
