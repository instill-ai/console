import { useMemo } from "react";
import {
  ModeCell,
  NameCell,
  PipelineTableHead,
  PipelineTablePlaceholder,
  TableBody,
  TableRow,
  InstanceCell,
 TableContainer } from "@/components/ui";
import { Mode, Status } from "@/types/general";
import { ConnectionTypeCell } from "@/components/ui/TableCells";
import {
  ModelState,
  transformModelStateToStatus,
} from "../model/ModelServices";

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
  name: string;
  description: string;
  mode: PipelineMode;
  state: PipelineState;
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
  models: {
    name: string;
    instance_name: string;
    state: ModelState;
  }[];
};

export const mockPipelines: Pipeline[] = [
  {
    id: "pipeline-1",
    name: "Yet another mock pipeline - 1",
    description: "helllo",
    mode: "MODE_ASYNC",
    state: "STATE_ACTIVE",
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
          name: "YOLOv4",
          instance_name: "v1.0.0",
          state: "STATE_ONLINE",
        },
        {
          name: "YOLOv3",
          instance_name: "v2.0.0",
          state: "STATE_OFFLINE",
        },
      ],
    },
  },
];

export const usePipelineTable = (
  pipelines: Pipeline[],
  isLoadingPipeline: boolean
) => {
  const pipelineTable = useMemo(() => {
    if (isLoadingPipeline) {
      return <div>isLoading</div>;
    }

    if (pipelines.length === 0) {
      return <PipelineTablePlaceholder />;
    }

    return (
      <TableContainer borderCollapse="border-collapse">
        <PipelineTableHead offlineCounts={1} onlineCounts={1} errorCounts={1} />
        <TableBody>
          {pipelines.map((pipeline) => (
            <TableRow key={pipeline.id}>
              <NameCell
                name={pipeline.name}
                width="w-[191px]"
                updatedAt={pipeline.update_time}
                status={transformStateToStatus(pipeline.state)}
              />
              <ModeCell width="w-[100px]" mode={transformMode(pipeline.mode)} />
              <ConnectionTypeCell
                width="w-[125px]"
                type={pipeline.recipe.source.name}
                name={pipeline.recipe.source.type}
              />
              <InstanceCell
                type="model"
                width="w-[190px]"
                instances={pipeline.recipe.models.map((model) => {
                  return {
                    name: `${model.name}/${model.instance_name}`,
                    status: transformModelStateToStatus(model.state),
                  };
                })}
              />
              <ConnectionTypeCell
                width="w-[125px]"
                type={pipeline.recipe.destination.name}
                name={pipeline.recipe.destination.type}
              />
            </TableRow>
          ))}
        </TableBody>
      </TableContainer>
    );
  }, [pipelines, isLoadingPipeline]);

  return pipelineTable;
};

const transformStateToStatus = (state: PipelineState): Status => {
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

const transformMode = (mode: PipelineMode): Mode => {
  if (mode === "MODE_ASYNC") return "async";
  else if (mode === "MODE_SYNC") return "sync";
  else return "unspecific";
};
