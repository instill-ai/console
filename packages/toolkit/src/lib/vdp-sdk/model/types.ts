/* eslint-disable  @typescript-eslint/no-explicit-any */

import { GeneralRecord, ModelWatchState, Pipeline } from "instill-sdk";
import { Nullable } from "vitest";

import { InstillJSONSchema } from "../../use-instill-form";
import { User } from "../mgmt/types";
import { Operation } from "../operation/types";
import { Organization } from "../organization";
import { Permission, RunSource, RunStatus, Visibility } from "../types";

export type ModelReleaseStage =
  | "RELEASE_STAGE_UNSPECIFIED"
  | "RELEASE_STAGE_ALPHA"
  | "RELEASE_STAGE_BETA"
  | "RELEASE_STAGE_GENERALLY_AVAILABLE"
  | "RELEASE_STAGE_CUSTOM";

/* -------------------------------------------------------------------------
 * Model Definition
 * -----------------------------------------------------------------------*/

export type ModelDefinition = {
  name: string;
  uid: string;
  id: string;
  title: string;
  documentationUrl: string;
  icon: string;
  releaseStage: ModelReleaseStage;
  modelSpec: Record<string, any>;
  createTime: string;
  updateTime: string;
};

/* -------------------------------------------------------------------------
 * Model
 * -----------------------------------------------------------------------*/

export type Model = {
  name: string;
  uid: string;
  id: string;
  description: string;
  modelDefinition: string;
  configuration: Record<string, string>;
  task: ModelTask;
  visibility: Visibility;
  createTime: string;
  updateTime: string | null;
  deleteTime: string | null;
  ownerName: string;
  owner: {
    user?: User;
    organization?: Organization;
  };
  region: string;
  hardware: string;
  readme: string;
  sourceUrl: string;
  documentationUrl: string;
  license: string;
  profileImage: string;
  permission: Permission;
  inputSchema: InstillJSONSchema | null;
  outputSchema: InstillJSONSchema | null;
  sampleInput: Record<string, Record<string, any>>;
  sampleOutput: Record<string, Record<string, any>>;
};

export type ModelState =
  | "STATE_UNSPECIFIED"
  | "STATE_STARTING"
  | "STATE_OFFLINE"
  | "STATE_SCALING_UP"
  | "STATE_SCALING_DOWN"
  | "STATE_ACTIVE"
  | "STATE_IDLE"
  | "STATE_ERROR";

export type ModelReadme = {
  name: string;
  size: number;
  type: string;
  content: string;
  encoding: string;
};

export type ModelTask =
  | "TASK_CLASSIFICATION"
  | "TASK_DETECTION"
  | "TASK_KEYPOINT"
  | "TASK_OCR"
  | "TASK_INSTANCE_SEGMENTATION"
  | "TASK_SEMANTIC_SEGMENTATION"
  | "TASK_TEXT_GENERATION"
  | "TASK_TEXT_GENERATION_CHAT"
  | "TASK_TEXT_TO_IMAGE"
  | "TASK_IMAGE_TO_IMAGE"
  | "TASK_VISUAL_QUESTION_ANSWERING";

export type ModelHubPreset = {
  id: string;
  description: string;
  task: string;
  modelDefinition: string;
  configuration: Record<string, string>;
};

export type ModelWithPipelines = Model & {
  pipelines: Pipeline[];
};

export type ModelRegion = {
  regionName: string;
  hardware: string[];
};

export type ModelRun = {
  uid: string;
  modelUid: string;
  requesterId: string;
  status: RunStatus;
  source: RunSource;
  totalDuration: number;
  endTime: string;
  createTime: string;
  updateTime: string;
  version: string;
  taskInputs: GeneralRecord[];
  taskOutputs: Record<string, any>[];
  credits: Nullable<number>;
}

export type ModelVersion = {
  name: string;
  version: string;
  digest: string;
  state: ModelState;
  updateTime: string;
};

export type ModelsWatchState = Record<string, Nullable<ModelWatchState>>;

export type ModelTriggerResult = {
  operation: Nullable<
    Operation & {
      response?: {
        "@type": string;
        request: {
          name: string;
          taskInputs: Record<string, any>[];
          version: string;
        };
        response: {
          task: string;
          taskOutputs: Record<string, any>[];
        };
      };
    }
  >;
};