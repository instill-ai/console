import * as React from "react";
import {
  ModelsChart,
  ModelTriggersStatusSummary,
  Nullable,
  PipelinesChart,
} from "instill-sdk";

import { SelectOption } from "@instill-ai/design-system";

import { PipelineTriggersStatusSummary } from "../../../lib";
import { FilterByDay } from "../FilterByDay";
import { ModelsTriggerCountsLineChart } from "./ModelsTriggerCountsLineChart";
import { PipelineTriggerCountsLineChart } from "./PipelineTriggerCountsLineChart";

type ActivityTabProps = {
  pipelinesChart: {
    isLoading: boolean;
    refetch: () => void;
  };
  modelsChart: {
    isLoading: boolean;
    refetch: () => void;
  };
  pipelinesChartList: PipelinesChart[];
  modelsChartList: ModelsChart[];
  selectedTimeOption: SelectOption;
  setSelectedTimeOption: React.Dispatch<React.SetStateAction<SelectOption>>;
  pipelineTriggersSummary: Nullable<PipelineTriggersStatusSummary>;
  modelTriggersSummary: Nullable<ModelTriggersStatusSummary>;
};

export const ActivityTab = ({
  pipelinesChart,
  modelsChart,
  pipelinesChartList,
  modelsChartList,
  selectedTimeOption,
  setSelectedTimeOption,
  pipelineTriggersSummary,
  modelTriggersSummary,
}: ActivityTabProps) => {
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-end items-center sm:items-center mb-5">
        <FilterByDay
          refetch={() => pipelinesChart.refetch()}
          selectedTimeOption={selectedTimeOption}
          setSelectedTimeOption={setSelectedTimeOption}
        />
      </div>
      <div className="w-full flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-1/2">
          <PipelineTriggerCountsLineChart
            isLoading={pipelinesChart.isLoading}
            pipelines={pipelinesChartList}
            selectedTimeOption={selectedTimeOption}
            pipelineTriggersSummary={pipelineTriggersSummary}
          />
        </div>
        <div className="w-full lg:w-1/2">
          <ModelsTriggerCountsLineChart
            isLoading={modelsChart.isLoading}
            models={modelsChartList}
            selectedTimeOption={selectedTimeOption}
            modelTriggersSummary={modelTriggersSummary}
          />
        </div>
      </div>
    </div>
  );
};
