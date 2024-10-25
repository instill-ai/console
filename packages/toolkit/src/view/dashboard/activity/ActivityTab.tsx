import * as React from "react";
import { Icons, Input, SelectOption } from "@instill-ai/design-system";
import { FilterByDay } from "../FilterByDay";
import { PipelineTriggerCountsLineChart } from "../PipelineTriggerCountsLineChart";
import { ModelsTriggerCountsLineChart } from "../ModelsTriggerCountsLineChart";
import { ModelsChart, ModelTriggersStatusSummary, PipelinesChart, PipelineTriggersStatusSummary } from "../../../lib";
import { Nullable } from "instill-sdk";

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
    const [searchTerm, setSearchTerm] = React.useState("");

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">

                    <Input.Root className="!rounded w-full sm:w-[250px]">
                        <Input.LeftIcon>
                            <Icons.SearchSm className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
                        </Input.LeftIcon>
                        <Input.Core
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Input.Root>
                </div>
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