/* eslint-disable  @typescript-eslint/no-explicit-any */

// ###################################################################
// #                                                                 #
// # Model Definition                                                #
// #                                                                 #
// ###################################################################

export type ModelDefinition = {
  name: string;
  uid: string;
  id: string;
  title: string;
  documentation_url: string;
  icon: string;
  model_spec: Record<string, any>;
  model_instance_spec: Record<string, any>;
  create_time: string;
  update_time: string;
};

// ###################################################################
// #                                                                 #
// # Model                                                           #
// #                                                                 #
// ###################################################################

export type Model = {
  name: string;
  uid: string;
  id: string;
  description: string;
  model_definition: string;
  configuration: string;
  visibility: string;
  user: string;
  org: string;
  create_time: string;
  update_time: string;
};

// - Becasuse model itself doesn't have state, we have to conclude model
// state using model_instance state.
// - model_instance.error > model_instance.online > model_instance.offline
// - Model state will be error if there exist a error model_insance

export type ModelWithInstance = Model & {
  instances: ModelInstance[];
  state: ModelState;
};

// ###################################################################
// #                                                                 #
// # Model Instance                                                  #
// #                                                                 #
// ###################################################################

export type ModelState = "STATE_ONLINE" | "STATE_OFFLINE" | "STATE_ERROR";

export type ModelInstance = {
  name: string;
  uid: string;
  id: string;
  state: ModelState;
  task: string;
  model_definition: string;
  configuration: string;
  create_time: string;
  update_time: string;
};

export type ModelInstanceReadme = {
  name: string;
  size: number;
  type: string;
  contents: string;
  encoding: string;
};
