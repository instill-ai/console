"use client";

import * as React from 'react';
import * as echarts from "echarts";
import { Icons, Tooltip, SelectOption } from "@instill-ai/design-system";
import { PipelinesChart, PipelineTriggersStatusSummary } from "../../lib";
import { Nullable } from 'instill-sdk';

type TotalCreditCostChartProps = {
    isLoading: boolean;
    pipelines: PipelinesChart[];
    selectedTimeOption: SelectOption;
    pipelineTriggersSummary: Nullable<PipelineTriggersStatusSummary>;
};

export const TotalCreditCostChart = ({
    isLoading,
    pipelines,
    selectedTimeOption,
    pipelineTriggersSummary,
}: TotalCreditCostChartProps) => {
    const chartRef = React.useRef<HTMLDivElement>(null);
    console.log(isLoading, pipelines, selectedTimeOption, pipelineTriggersSummary)

    // Mock data
    const pipelinePercentage = 66;
    const modelPercentage = 34;
    const totalCreditCost = 70310;
    const pipelineDelta = 5;
    const modelDelta = -2;

    React.useEffect(() => {
        if (chartRef.current) {
            // Dispose the previous chart instance
            echarts.dispose(chartRef.current); // eslint-disable-line
            const myChart = echarts.init(chartRef.current, null, {
                renderer: "svg",
            }); // eslint-disable-line
            const option = {
                series: [
                    {
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { value: pipelinePercentage, name: 'Pipeline', itemStyle: { color: '#3B7AF7' } },
                            { value: modelPercentage, name: 'Model', itemStyle: { color: '#2EC291' } },
                        ]
                    }
                ]
            };

            myChart.setOption(option, true);
        }
    }, [pipelinePercentage, modelPercentage]);

    // if (isLoading) {
    //     return <div>Loading...</div>;
    // }

    return (
        <div className="inline-flex w-full flex-col items-start justify-start rounded-sm bg-semantic-bg-primary shadow">
            <div className="flex flex-col items-start justify-start gap-[30px] self-stretch">
                <div className="inline-flex items-center justify-between gap-2.5 self-stretch pt-8 px-8">
                    <div className="flex items-center justify-start gap-2.5">
                        <div className="text-semantic-fg-primary product-headings-heading-2">
                            Total Credit Cost
                        </div>
                        <Tooltip.Provider>
                            <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                    <div className="relative h-4 w-4">
                                        <Icons.AlertCircle className="h-4 w-4 stroke-semantic-fg-primary" />
                                    </div>
                                </Tooltip.Trigger>
                                <Tooltip.Portal>
                                    <Tooltip.Content
                                        className="rounded-sm"
                                        sideOffset={5}
                                        side={"right"}
                                    >
                                        <div className="inline-flex w-80 flex-col items-start justify-start rounded-sm bg-semantic-bg-primary p-3">
                                            <div className="flex flex-col items-start justify-start gap-1 self-stretch">
                                                <div className="self-stretch text-semantic-fg-primary product-body-text-4-semibold">
                                                    Total Credit Cost tooltip
                                                </div>
                                                <div className="self-stretch text-semantic-fg-secondary product-body-text-4-medium">
                                                    View the total credit cost and distribution between pipeline and model usage.
                                                </div>
                                            </div>
                                        </div>
                                        <Tooltip.Arrow
                                            className="fill-semantic-bg-primary"
                                            offset={10}
                                            width={9}
                                            height={6}
                                        />
                                    </Tooltip.Content>
                                </Tooltip.Portal>
                            </Tooltip.Root>
                        </Tooltip.Provider>
                    </div>
                    <div className="text-semantic-fg-secondary product-button-button-2 px-3 py-1 border border-semantic-fg-disabled rounded-full">
                        Top Up Credits
                    </div>
                </div>
                <div className="px-8 pb-8 w-full flex items-center" style={{ height: '460px' }}>
                    <div className="w-1/2 relative">
                        <div
                            ref={chartRef}
                            style={{ width: "100%", height: "400px" }}
                        />
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <div className="text-semantic-fg-primary product-body-text-4-regular">Total Credit Cost</div>
                            <div className="text-semantic-fg-primary product-headings-heading-1">{totalCreditCost.toLocaleString()}</div>
                        </div>
                    </div>
                    <div className="w-1/2 flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-[#3B7AF7]"></div>
                            <span className="text-semantic-fg-primary product-body-text-4-regular">Pipeline</span>
                            <span className="text-semantic-fg-primary product-body-text-4-regular ml-auto">{pipelinePercentage}%</span>
                            {pipelineDelta > 0 ? (
                                <Icons.ArrowUp className="h-4 w-4 stroke-semantic-success-default" />
                            ) : (
                                <Icons.ArrowDown className="h-4 w-4 stroke-semantic-error-default" />
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-[#2EC291]"></div>
                            <span className="text-semantic-fg-primary product-body-text-4-regular">Model</span>
                            <span className="text-semantic-fg-primary product-body-text-4-regular ml-auto">{modelPercentage}%</span>
                            {modelDelta > 0 ? (
                                <Icons.ArrowUp className="h-4 w-4 stroke-semantic-success-default" />
                            ) : (
                                <Icons.ArrowDown className="h-4 w-4 stroke-semantic-error-default" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};