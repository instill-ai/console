"use client";

import * as React from "react";
import { Icons, Input, Popover, SelectOption } from "@instill-ai/design-system";
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

    const options = [
        { value: "pipeline", label: "Pipeline", icon: <Icons.Pipeline className="h-4 w-4" /> },
        { value: "model", label: "Model", icon: <Icons.Model className="h-4 w-4" /> },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-5">
                <div className="flex space-x-3">
                    <Popover.Root>
                        <Popover.Trigger asChild>
                            <button className="flex flex-row gap-x-2 rounded border border-semantic-bg-line bg-semantic-bg-primary px-4 py-3 text-semantic-fg-primary product-button-button-1">
                                {options.find((o) => o.value === costView)?.label}
                                <Icons.ChevronDown className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
                            </button>
                        </Popover.Trigger>
                        <Popover.Content align="start" className="flex w-48 flex-col !px-0 py-1">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    className={`flex items-center p-2 hover:bg-semantic-bg-line ${costView === option.value ? "bg-semantic-bg-line" : ""
                                        }`}
                                    onClick={() => setCostView(option.value as "pipeline" | "model")}
                                >
                                    {option.icon}
                                    <span className="ml-2">{option.label}</span>
                                    {costView === option.value && (
                                        <Icons.Check className="ml-auto h-4 w-4 stroke-semantic-fg-primary" />
                                    )}
                                </button>
                            ))}
                        </Popover.Content>
                    </Popover.Root>

                    <Input.Root className="!rounded w-[250px]">
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
