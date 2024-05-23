/* eslint-disable  @typescript-eslint/no-explicit-any */

import { InstillJSONSchema } from "../../use-instill-form";
import { User } from "../mgmt/types";
import { Organization } from "../organization";
import { Pipeline } from "../pipeline";
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
  configuration: Record<string, string>;
  task: ModelTask;
  visibility: Visibility;
  create_time: string;
  update_time: string | null;
  delete_time: string | null;
  owner_name: string;
  owner: {
    user?: User;
    organization?: Organization;
  };
  region: string;
  hardware: string;
  readme: string;
  source_url: string;
  documentation_url: string;
  license: string;
  profile_image: string;
  permission: Permission;
  input_schema: InstillJSONSchema | null;
  output_schema: InstillJSONSchema | null;
};

export type ModelState =
  | "STATE_UNSPECIFIED"
  | "STATE_OFFLINE"
  | "STATE_SCALING"
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
  model_definition: string;
  configuration: Record<string, string>;
};

export type ModelWithPipelines = Model & {
  pipelines: Pipeline[];
};

export type ModelRegion = {
  region_name: string;
  hardware: string[];
};

export type ModelVersion = {
  name: string;
  id: string;
  digest: string;
  state: ModelState;
  update_time: string;
};
