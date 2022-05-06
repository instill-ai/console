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

export const mockPipelines: Pipeline[] = [
  {
    id: "pipeline-1",
    name: "Yet another mock pipeline - 1",
    description: "helllo",
    mode: "MODE_ASYNC",
    status: "STATUS_ACTIVATED",
    owner_id: "summerbud",
    full_name: "Summberbud",
    create_time: "2022-05-06T09:00:00",
    update_time: "2022-05-06T09:00:00",
    recipe: {
      source: {
        name: "mysql",
      },
      destination: {
        name: "mysql",
      },
      model: {
        name: "YOLOv4",
        instance_name: "v1.0.0",
      },
    },
  },
];
