/* eslint-disable  @typescript-eslint/no-explicit-any */

import { Pipeline } from "../pipeline";
import { Visibility } from "../types";

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
  documentation_url: string;
  icon: string;
  release_stage: ModelReleaseStage;
  model_spec: Record<string, any>;
  create_time: string;
  update_time: string;
};

/* -------------------------------------------------------------------------
 * Model
 * -----------------------------------------------------------------------*/

export type Model = {
  name: string;
  uid: string;
  id: string;
  description: string;
  model_definition: string;
  configuration: {
    [key: string]: any;
  };
  task: string;
  state: ModelState;
  visibility: Visibility;
  owner: string;
  create_time: string;
  update_time: string;
};

export type ModelState =
  | "STATE_ONLINE"
  | "STATE_OFFLINE"
  | "STATE_ERROR"
  | "STATE_UNSPECIFIED";

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
  | "TASK_TEXT_TO_IMAGE"
  | "TASK_IMAGE_TO_IMAGE"
  | "TASK_IMAGE_TO_TEXT";

export type ModelHubPreset = {
  id: string;
  description: string;
  task: string;
  model_definition: string;
  configuration: Record<string, string>;
};

export type ModelWatchState = {
  state: ModelState;
  progress: number;
};

export type ModelsWatchState = Record<string, ModelWatchState>;

export type ModelWithPipelines = Model & {
  pipelines: Pipeline[];
};
