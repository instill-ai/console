"use client";

import * as React from "react";
import { Icons, Input, Select, SelectOption } from "@instill-ai/design-system";
import { FilterByDay } from "./FilterByDay";
import { CreditCostTrendChart } from "./CreditCostTrendChart";
import { DataTableDashboard } from "./DataTableDashboard";
import { columns, mockTableData } from "./helpers";
import { PipelinesChart, PipelineTriggersStatusSummary } from "../../lib";
import { Nullable } from "instill-sdk";

type CostTabProps = {
    pipelinesChart: {
        isLoading: boolean;
        refetch: () => void;
    };
    pipelinesChartList: PipelinesChart[];
    selectedTimeOption: SelectOption;
    setSelectedTimeOption: React.Dispatch<React.SetStateAction<SelectOption>>;
    pipelineTriggersSummary: Nullable<PipelineTriggersStatusSummary>;
};

export const CostTab = ({
    pipelinesChart,
    pipelinesChartList,
    selectedTimeOption,
    setSelectedTimeOption,
    pipelineTriggersSummary,
}: CostTabProps) => {
    const [costView, setCostView] = React.useState<"model" | "pipeline">("pipeline");
    const [searchTerm, setSearchTerm] = React.useState("");

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-4">
                    <Select.Root value={costView} onValueChange={(value) => setCostView(value as "model" | "pipeline")}>
                        <Select.Trigger className="w-40">
                            <Select.Value placeholder="Select view" />
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Item value="pipeline">Pipeline</Select.Item>
                            <Select.Item value="model">Model</Select.Item>
                        </Select.Content>
                    </Select.Root>
                    <Input.Root className="!rounded">
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
            <div className="mb-2 w-full">
                <CreditCostTrendChart
                    isLoading={pipelinesChart.isLoading}
                    pipelines={pipelinesChartList}
                    selectedTimeOption={selectedTimeOption}
                    pipelineTriggersSummary={pipelineTriggersSummary}
                    costView={costView}
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