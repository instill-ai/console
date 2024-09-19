import * as React from "react";
import { Icons, Input, Popover, SelectOption } from "@instill-ai/design-system";
import { FilterByDay } from "./FilterByDay";
import { PipelineTriggerCountsLineChart } from "./PipelineTriggerCountsLineChart";
import { ModelsTriggerCountsLineChart } from "./ModelsTriggerCountsLineChart";
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
    const [sortOption, setSortOption] = React.useState<"newest" | "oldest">("newest");
    const [searchTerm, setSearchTerm] = React.useState("");

    const options = [
        { value: "newest", label: "Newest", icon: <Icons.ClockPlus className="h-4 w-4" /> },
        { value: "oldest", label: "Oldest", icon: <Icons.ClockCheck className="h-4 w-4" /> },
    ];

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                    <Popover.Root>
                        <Popover.Trigger asChild>
                            <button className="flex flex-row gap-x-2 rounded border border-semantic-bg-line bg-semantic-bg-primary px-4 py-3 text-semantic-fg-primary product-button-button-1">
                                {options.find((o) => o.value === sortOption)?.label}
                                <Icons.ChevronDown className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
                            </button>
                        </Popover.Trigger>
                        <Popover.Content align="start" className="flex w-48 flex-col !px-0 py-1">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    className={`flex items-center p-2 hover:bg-semantic-bg-line ${sortOption === option.value ? "bg-semantic-bg-line" : ""
                                        }`}
                                    onClick={() => setSortOption(option.value as "newest" | "oldest")}
                                >
                                    {option.icon}
                                    <span className="ml-2">{option.label}</span>
                                    {sortOption === option.value && (
                                        <Icons.Check className="ml-auto h-4 w-4 stroke-semantic-fg-primary" />
                                    )}
                                </button>
                            ))}
                        </Popover.Content>
                    </Popover.Root>

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
                        isLoading={pipelinesChart.isLoading}
                        pipelines={pipelinesChartList}
                        selectedTimeOption={selectedTimeOption}
                        pipelineTriggersSummary={pipelineTriggersSummary}
                    />
                </div>
            </div>
        </div>
    );
};