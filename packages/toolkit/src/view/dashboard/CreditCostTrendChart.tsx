"use client";

import * as React from 'react';
import * as echarts from "echarts";
import { Icons, Tooltip, SelectOption } from "@instill-ai/design-system";
import { PipelinesChart, PipelineTriggersStatusSummary } from "../../lib";
import { Nullable } from 'instill-sdk';

type CreditCostTrendChartProps = {
    isLoading: boolean;
    pipelines: PipelinesChart[];
    selectedTimeOption: SelectOption;
    pipelineTriggersSummary: Nullable<PipelineTriggersStatusSummary>;
    costView: "model" | "pipeline";
};

export const CreditCostTrendChart = ({
    isLoading,
    pipelines,
    selectedTimeOption,
    pipelineTriggersSummary,
    costView,
}: CreditCostTrendChartProps) => {
    const chartRef = React.useRef<HTMLDivElement>(null);

    const mockData = React.useMemo(() => [
        { date: '2023-09-01', value: 150 },
        { date: '2023-09-02', value: 200 },
        { date: '2023-09-03', value: 180 },
        { date: '2023-09-04', value: 220 },
        { date: '2023-09-05', value: 250 },
        { date: '2023-09-06', value: 190 },
        { date: '2023-09-07', value: 210 },
    ], []);

    React.useEffect(() => {
        if (chartRef.current) {
            const chart = echarts.init(chartRef.current, null, {
                renderer: "svg",
            });

            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function (params: { axisValue: string; value: number }[]) {
                        const date = params[0]?.axisValue ?? '';
                        const value = params[0]?.value ?? 0;
                        return `
                            <div style="font-size: 14px; color: #666;">
                                <div style="margin-bottom: 5px;">${date}</div>
                                <div>
                                    <span style="display: inline-block; width: 10px; height: 10px; background-color: ${costView === 'pipeline' ? '#3B7AF7' : '#2EC291'}; margin-right: 5px;"></span>
                                    ${costView === 'pipeline' ? 'Pipeline' : 'Model'}: ${value}
                                </div>
                            </div>
                        `;
                    }
                },
                xAxis: {
                    type: 'category',
                    data: mockData.map(item => item.date)
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: costView === 'pipeline' ? 'Pipeline' : 'Model',
                        type: 'bar',
                        data: mockData.map(item => item.value),
                        itemStyle: { color: costView === 'pipeline' ? '#3B7AF7' : '#2EC291' },
                        barWidth: 30
                    }
                ]
            };

            chart.setOption(option);

            return () => {
                chart.dispose();
            };
        }
    }, [costView, isLoading, pipelines, selectedTimeOption, pipelineTriggersSummary, mockData]);

    return (
        <div className="inline-flex w-full flex-col items-start justify-start rounded-sm bg-semantic-bg-primary shadow">
            <div className="flex flex-col items-start justify-start gap-[30px] self-stretch">
                <div className="inline-flex items-center justify-between gap-2.5 self-stretch pt-8 px-8">
                    <div className="flex items-center justify-start gap-2.5">
                        <div className="text-semantic-fg-primary product-headings-heading-2">
                            Credit Cost Trend
                        </div>
                        <Tooltip.Provider>
                            <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                    <div className="relative h-3.5 w-3.5">
                                        <Icons.AlertCircle className="h-3.5 w-3.5 stroke-semantic-fg-primary" />
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
                                                    Credit Cost Trend
                                                </div>
                                                <div className="self-stretch text-semantic-fg-secondary product-body-text-4-medium">
                                                    View the trend of credit cost for {costView === 'pipeline' ? 'pipelines' : 'models'} over time.
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
                        View billing details
                    </div>
                </div>
                <div className="px-8 pb-8 w-full" style={{ height: '460px' }}>
                    <div
                        ref={chartRef}
                        style={{ width: "100%", height: "400px" }}
                    />
                </div>
            </div>
        </div>
    );
};