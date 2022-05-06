export type Pipeline = {
  id: string;
  name: string;
  description: string;
  mode: "MODE_UNSPECIFIED" | "MODE_SYNC" | "MODE_ASYNC";
  status:
    | "STATUS_UNSPECIFIED"
    | "STATUS_INACTIVATED"
    | "STATUS_ACTIVATED"
    | "STATUS_ERROR";
  owner_id: string;
  full_name: string;
  create_time: string;
  update_time: string;
  recipe: PipelineRecipe;
};

export type PipelineRecipe = {
  source: {
    name: string;
  };
  destination: {
    name: string;
  };
  model: {
    name: string;
    instance_name: string;
  };
};
