"use client";

import * as React from "react";
import { Icons, Popover, SelectOption } from "@instill-ai/design-system";
import { useRouter, usePathname } from "next/navigation";
import { FilterByDay } from "./FilterByDay";
import { DashboardListPipeline } from "./cost/pipeline/DashboardListPipeline";
import { DashboardListModel } from "./cost/model/DashboardListModel";
import { ModelCreditCostTrendChart } from "./cost/model/ModelCreditCostTrendChart";
import { PipelineCreditCostTrendChart } from "./cost/pipeline/PipelineCreditCostTrendChart";
import { Nullable } from "instill-sdk";
import { useAuthenticatedUser, useCreditConsumptionChartRecords } from "../../lib";

type CostTabProps = {
    selectedTimeOption: SelectOption;
    setSelectedTimeOption: React.Dispatch<React.SetStateAction<SelectOption>>;
    accessToken: Nullable<string>;
    enabledQuery: boolean;
};

type ChartData = {
    dates: string[];
    values: number[];
};

export const CostTab = ({
    selectedTimeOption,
    setSelectedTimeOption,
    accessToken,
    enabledQuery,
}: CostTabProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const costView = pathname.includes("/cost/model") ? "model" : "pipeline";

    const me = useAuthenticatedUser({
        enabled: enabledQuery,
        accessToken,
    });

    const start = React.useMemo(() => {
        if (selectedTimeOption.value === "24h") {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return today.toISOString();
        }
        const date = new Date();
        date.setDate(date.getDate() - parseInt(selectedTimeOption.value));
        return date.toISOString();
    }, [selectedTimeOption.value]);

    const stop = React.useMemo(() => {
        return new Date().toISOString();
    }, []);

    const creditConsumption = useCreditConsumptionChartRecords({
        enabled: enabledQuery,
        accessToken,
        namespaceId: me.data?.id ?? "",
        start,
        stop,
        aggregationWindow: selectedTimeOption.value === "24h" ? "1h" : "24h",
    });

    // Extract model and pipeline data
    const modelChartData: ChartData = React.useMemo(() => {
        const modelRecord = creditConsumption.data?.creditConsumptionChartRecords?.find(
            (record) => record.source === "model"
        );
        if (modelRecord) {
            return {
                dates: modelRecord.timeBuckets,
                values: modelRecord.amount,
            };
        }
        return { dates: [], values: [] };
    }, [creditConsumption.data]);

    const pipelineChartData: ChartData = React.useMemo(() => {
        const pipelineRecord = creditConsumption.data?.creditConsumptionChartRecords?.find(
            (record) => record.source === "pipeline"
        );
        if (pipelineRecord) {
            return {
                dates: pipelineRecord.timeBuckets,
                values: pipelineRecord.amount,
            };
        }
        return { dates: [], values: [] };
    }, [creditConsumption.data]);

    const options = [
        {
            value: "pipeline",
            label: "Pipeline",
            icon: <Icons.Pipeline className="h-4 w-4" />
        },
        {
            value: "model",
            label: "Model",
            icon: <Icons.Model className="h-4 w-4" />
        },
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
                                    className={`flex items-center p-2 hover:bg-semantic-bg-line ${costView === option.value ? "bg-semantic-bg-line" : ""}`}
                                    onClick={() => {
                                        router.push(`/${me?.data?.id}/dashboard/cost/${option.value}`);
                                    }}
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
                </div>
                <FilterByDay
                    refetch={() => creditConsumption.refetch()}
                    selectedTimeOption={selectedTimeOption}
                    setSelectedTimeOption={setSelectedTimeOption}
                />
            </div>

            <div className="mb-2 w-full">
                {costView === "model" ? (
                    <ModelCreditCostTrendChart
                        dates={modelChartData.dates}
                        values={modelChartData.values}
                        isLoading={creditConsumption.isLoading}
                        namespaceId={me.data?.id ?? ""}
                    />
                ) : (
                    <PipelineCreditCostTrendChart
                        dates={pipelineChartData.dates}
                        values={pipelineChartData.values}
                        isLoading={creditConsumption.isLoading}
                        namespaceId={me.data?.id ?? ""}
                    />
                )}
            </div>

            <div className="mt-8">
                {costView === "model" ? (
                    <DashboardListModel />
                ) : (
                    <DashboardListPipeline />
                )}
            </div>
        </div>
    );
};
