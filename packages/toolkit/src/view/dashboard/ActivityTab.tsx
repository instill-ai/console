"use client";

import * as React from "react";
import { Select, SelectOption } from "@instill-ai/design-system";
import { FilterByDay } from "./FilterByDay";
import { PipelineTriggerCountsLineChart } from "./PipelineTriggerCountsLineChart";
import { DataTableDashboard } from "./DataTableDashboard";
import { columns, mockTableData } from "./helpers";
import { PipelinesChart, PipelineTriggersStatusSummary } from "../../lib";
import { Nullable } from "instill-sdk";

type ActivityTabProps = {
    pipelinesChart: {
        isLoading: boolean;
        refetch: () => void;
    };
    pipelinesChartList: PipelinesChart[];
    selectedTimeOption: SelectOption;
    setSelectedTimeOption: React.Dispatch<React.SetStateAction<SelectOption>>;
    pipelineTriggersSummary: Nullable<PipelineTriggersStatusSummary>;
};

export const ActivityTab = ({
    pipelinesChart,
    pipelinesChartList,
    selectedTimeOption,
    setSelectedTimeOption,
    pipelineTriggersSummary,
}: ActivityTabProps) => {
    const [sortOption, setSortOption] = React.useState("newest");

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-4">
                    <Select.Root value={sortOption} onValueChange={(value) => setSortOption(value)}>
                        <Select.Trigger className="w-40">
                            <Select.Value placeholder="Sort by" />
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Item value="newest">Newest</Select.Item>
                            <Select.Item value="oldest">Oldest</Select.Item>
                        </Select.Content>
                    </Select.Root>
                </div>
                <FilterByDay
                    refetch={() => pipelinesChart.refetch()}
                    selectedTimeOption={selectedTimeOption}
                    setSelectedTimeOption={setSelectedTimeOption}
                />
            </div>
            <div className="mb-8 w-full">
                <PipelineTriggerCountsLineChart
                    isLoading={pipelinesChart.isLoading}
                    pipelines={pipelinesChartList}
                    selectedTimeOption={selectedTimeOption}
                    pipelineTriggersSummary={pipelineTriggersSummary}
                />
            </div>
            <div className="mt-8">
                <DataTableDashboard
                    columns={columns}
                    data={mockTableData}
                    pageSize={10}
                    isLoading={pipelinesChart.isLoading}
                    loadingRows={10}
                />
            </div>
        </div>
    );
};