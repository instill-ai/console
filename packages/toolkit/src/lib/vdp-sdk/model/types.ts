/* eslint-disable  @typescript-eslint/no-explicit-any */

import { ModelWatchState, Pipeline } from "instill-sdk";
import { Nullable } from "vitest";

import { InstillJSONSchema } from "../../use-instill-form";
import { User } from "../mgmt/types";
import { Organization } from "../organization";
import { Permission, Visibility } from "../types";

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
  stats: {
    numberOfRuns: number;
    lastRunTime: string;
  };
  versions: string[];
  tags: string[];
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
  | "TASK_TEXT_TO_IMAGE"
  | "TASK_EMBEDDING"
  | "TASK_SPEECH_RECOGNITION"
  | "TASK_CHAT"
  | "TASK_COMPLETION"
  | "TASK_CUSTOM";

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

export type ModelVersion = {
  name: string;
  version: string;
  digest: string;
  state: ModelState;
  updateTime: string;
};

export type ModelsWatchState = Record<string, Nullable<ModelWatchState>>;
