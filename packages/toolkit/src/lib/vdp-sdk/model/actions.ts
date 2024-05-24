import { createInstillAxiosClient } from "../helper";
import { Nullable } from "../../type";
import { ModelTask } from "./types";

export type DeployUserModelResponse = {
  model_id: string;
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
      `/${modelName}/deploy`
    );
    return Promise.resolve(data.model_id);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type UndeployUserModelResponse = {
  model_id: string;
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
      `/${modelName}/undeploy`
    );
    return Promise.resolve(data.model_id);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type TriggerUserModelPayload = {
  task_inputs: Record<string, unknown>[];
};

export type TriggerUserModelResponse = {
  task: ModelTask;
  task_outputs: Record<string, Record<string, unknown>>[];
};

export async function triggerUserModelAction({
  modelName,
  payload,
  accessToken,
}: {
  modelName: string;
  payload: TriggerUserModelPayload;
  accessToken: Nullable<string>;
  returnTraces?: boolean;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, true);

    const { data } = await client.post<TriggerUserModelResponse>(
      `/${modelName}/trigger`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
}
