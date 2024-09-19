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
        { date: '2023-04-07 09:32:04', pipelineValue: 150, modelValue: 100 },
        { date: '2023-04-08 10:30:15', pipelineValue: 200, modelValue: 120 },
        { date: '2023-04-09 11:45:30', pipelineValue: 180, modelValue: 90 },
        { date: '2023-04-10 13:15:45', pipelineValue: 220, modelValue: 130 },
        { date: '2023-04-11 14:30:00', pipelineValue: 250, modelValue: 150 },
        { date: '2023-04-12 16:00:20', pipelineValue: 190, modelValue: 110 },
        { date: '2023-04-13 17:30:40', pipelineValue: 210, modelValue: 140 },
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
                        const date = new Date(params[0]?.axisValue ?? '');
                        const formattedDate = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}, ${date.getFullYear()} - ${date.toTimeString().split(' ')[0]}`;
                        const value = params[0]?.value ?? 0;
                        const total = value;

                        return `
                            <div style="font-size: 14px; color: #666;">
                                <div class="product-body-text-4-medium" style="margin-bottom: 5px;">${formattedDate}</div>
                                <div style="display: flex; align-items: center; margin-bottom: 3px;">
                                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${costView === 'pipeline' ? '#3B7AF7' : '#2EC291'};"></span>
                                    <div class="product-body-text-3-medium" style="margin-left: 15px;">${value} (100%)</div>
                                </div>
                                <div class="product-body-text-3-regular">Total credits: <span class="product-body-text-3-semibold">${total}</span></div>
                            </div>
                        `;
                    }
                },
                xAxis: {
                    type: 'category',
                    data: mockData.map(item => item.date.split(' ')[0]),
                    axisLabel: {
                        formatter: (value: string) => {
                            const date = new Date(value);
                            return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
                        }
                    }
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: 'Pipeline',
                        type: 'bar',
                        data: mockData.map(item => costView === 'pipeline' ? item.pipelineValue : null),
                        itemStyle: { color: '#3B7AF7' },
                        barWidth: '24px'
                    },
                    {
                        name: 'Model',
                        type: 'bar',
                        data: mockData.map(item => costView === 'model' ? item.modelValue : null),
                        itemStyle: { color: '#2EC291' },
                        barWidth: '24px'
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