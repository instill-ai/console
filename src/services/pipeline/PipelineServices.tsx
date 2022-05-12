import { listRepoFileContent } from "@/lib/github";
import { Mode, Status } from "@/types/general";
import { useMemo } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Model, ModelState } from "../model/ModelServices";

type PipelineMode = "MODE_UNSPECIFIED" | "MODE_SYNC" | "MODE_ASYNC";

type PipelineState =
  | "STATE_UNSPECIFIED"
  | "STATE_ACTIVE"
  | "STATE_INACTIVE"
  | "STATE_ERROR";

export type ListPipelinesResponse = {
  id: string;
  name: string;
  description: string;
  recipe: PipelineRecipeFragment;
  mode: PipelineMode;
  state: PipelineState;
  owner_id: string;
  full_name: string;
  created_at: string;
  updated_at: string;
};

export type Pipeline = {
  id: string;
  description: string;
  mode: Mode;
  status: Status;
  owner_id: string;
  full_name: string;
  create_time: string;
  update_time: string;
  recipe: PipelineRecipe;
};

export type PipelineRecipeFragment = {
  source: {
    name: string;
  };
  destination: {
    name: string;
  };
  models: {
    name: string;
    instance_name: string;
  }[];
};

export type PipelineRecipe = {
  source: {
    name: string;
    type: string;
  };
  destination: {
    name: string;
    type: string;
  };
  models: Model[];
};

export const mockPipelines: Pipeline[] = [
  {
    id: "yet-another-mock-pipeline-1",
    description: "helllo",
    mode: "async",
    status: "active",
    owner_id: "summerbud",
    full_name: "Summberbud",
    create_time: "2022-05-06T09:00:00",
    update_time: "2022-05-06T09:00:00",
    recipe: {
      source: {
        name: "mysql-hi",
        type: "mysql",
      },
      destination: {
        name: "mysql-destination",
        type: "mysql",
      },
      models: [
        {
          id: "YOLOv4",
          instance: "v1.0.0",
          status: "online",
        },
        {
          id: "YOLOv3",
          instance: "v2.0.0",
          status: "offline",
        },
      ],
    },
  },
  {
    id: "yet-another-mock-pipeline-2",
    description: "nononononono hehee hee",
    mode: "async",
    status: "active",
    owner_id: "summerbud",
    full_name: "Summberbud",
    create_time: "2022-05-06T09:00:00",
    update_time: "2022-05-06T09:00:00",
    recipe: {
      source: {
        name: "test-salesforce",
        type: "salesforce",
      },
      destination: {
        name: "mysql-destination",
        type: "mysql",
      },
      models: [
        {
          id: "YOLOv4",
          instance: "v1.0.0",
          status: "online",
        },
        {
          id: "YOLOv3",
          instance: "v2.0.0",
          status: "offline",
        },
      ],
    },
  },
  {
    id: "yet-another-mock-pipeline-3",
    description: "nononononono hehee hee ddddddddd",
    mode: "async",
    status: "active",
    owner_id: "summerbud",
    full_name: "Summberbud",
    create_time: "2022-05-06T09:00:00",
    update_time: "2022-05-06T09:00:00",
    recipe: {
      source: {
        name: "http-hi",
        type: "http",
      },
      destination: {
        name: "http-destination",
        type: "http",
      },
      models: [
        {
          id: "YOLOv4",
          instance: "v1.0.0",
          status: "online",
        },
        {
          id: "YOLOv3",
          instance: "v2.0.0",
          status: "offline",
        },
      ],
    },
  },
];

export const transformPipelineStateToStatus = (
  state: PipelineState
): Status => {
  switch (state) {
    case "STATE_ACTIVE":
      return "active";
    case "STATE_INACTIVE":
      return "inactive";
    case "STATE_ERROR":
      return "error";
    default:
      return "unspecific";
  }
};

export const transformMode = (mode: PipelineMode): Mode => {
  if (mode === "MODE_ASYNC") return "async";
  else if (mode === "MODE_SYNC") return "sync";
  else return "unspecific";
};

export const usePipeline = (id?: string) => {
  return useQuery(
    ["pipelines", id],
    async () => {
      // Mock
      return mockPipelines.find((e) => e.id === id) as Pipeline;
    },
    { enabled: id ? true : false }
  );
};

export const usePipelines = (enable: boolean) => {
  const fetchPipelines = async () => {
    return Promise.resolve(mockPipelines);
  };

  return useQuery(["pipelines"], fetchPipelines, {
    enabled: enable ? true : false,
  });
};

export const usePipelineSchema = () => {
  const fetchPipelineSchema = async (): Promise<string> => {
    const data = await listRepoFileContent(
      "instill-ai",
      "pipeline-backend",
      "configs/models/pipeline.json"
    );
    return data.content;
  };

  const queryInfo = useQuery(
    ["pipeline", "encoded-definition"],
    fetchPipelineSchema
  );

  return {
    ...queryInfo,
    data: useMemo(() => {
      if (queryInfo.data) {
        return JSON.parse(window.atob(queryInfo.data));
      }
    }, [queryInfo.data]),
  };
};

export const usePipelinesHaveTargetSource = (sourceId: string | undefined) => {
  const pipelines = usePipelines(true);
  const queryClient = useQueryClient();

  return useQuery(
    ["pipelines", "pipelines-with-source", sourceId],
    async () => {
      const targetPipelines = [];

      if (!pipelines.data) {
        return Promise.reject("pipelines not exist");
      }

      for (const pipeline of pipelines.data) {
        if (pipeline.recipe.source.name === sourceId) {
          targetPipelines.push(pipeline);
        }
      }

      return Promise.resolve(targetPipelines);
    },
    {
      initialData: () => {
        const pipelines = queryClient.getQueryData<Pipeline[]>(["pipelines"]);

        if (pipelines) {
          const targetPipelines = [];

          for (const pipeline of pipelines) {
            if (pipeline.recipe.source.name === sourceId) {
              targetPipelines.push(pipeline);
            }
          }

          return targetPipelines;
        }
      },
      enabled: sourceId ? (pipelines.data ? true : false) : false,
    }
  );
};
