"use client";

import * as React from 'react';
import * as echarts from "echarts";
import { Icons, Tooltip, SelectOption } from "@instill-ai/design-system";
import { PipelinesChart, PipelineTriggersStatusSummary } from "../../lib";
import { Nullable } from 'instill-sdk';

type TotalCreditTrendChartProps = {
    isLoading: boolean;
    pipelines: PipelinesChart[];
    selectedTimeOption: SelectOption;
    pipelineTriggersSummary: Nullable<PipelineTriggersStatusSummary>;
};

export const TotalCreditTrendChart = ({
    isLoading,
    pipelines,
    selectedTimeOption,
    pipelineTriggersSummary,
}: TotalCreditTrendChartProps) => {
    const chartRef = React.useRef<HTMLDivElement>(null);

    // Mock data for the chart
    const mockData = [
        { date: '2023-09-01', pipeline: 150, model: 100 },
        { date: '2023-09-02', pipeline: 200, model: 120 },
        { date: '2023-09-03', pipeline: 180, model: 90 },
        { date: '2023-09-04', pipeline: 220, model: 150 },
        { date: '2023-09-05', pipeline: 250, model: 130 },
        { date: '2023-09-06', pipeline: 190, model: 110 },
        { date: '2023-09-07', pipeline: 210, model: 140 },
    ];

    React.useEffect(() => {
        if (chartRef.current) {
            echarts.dispose(chartRef.current);
            const myChart = echarts.init(chartRef.current, null, {
                renderer: "svg",
            });

            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
                    formatter: function (params: any) {
                        const date = params[0].axisValue;
                        const pipeline = params[0].value;
                        const model = params[1].value;
                        const total = pipeline + model;
                        return `
                            <div style="font-size: 14px; color: #666;">
                                <div style="margin-bottom: 5px;">${date}</div>
                                <div>
                                    <span style="display: inline-block; width: 10px; height: 10px; background-color: #3B7AF7; margin-right: 5px;"></span>
                                    Pipeline: ${pipeline}
                                </div>
                                <div>
                                    <span style="display: inline-block; width: 10px; height: 10px; background-color: #2EC291; margin-right: 5px;"></span>
                                    Model: ${model}
                                </div>
                                <div style="margin-top: 5px;">Total credits: ${total}</div>
                            </div>
                        `;
                    }
                },
                legend: {
                    data: ['Pipeline', 'Model'],
                    bottom: 0,
                    icon: 'rect',
                    itemWidth: 10,
                    itemHeight: 10,
                    style: "border-radius: 100px",
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
                        name: 'Pipeline',
                        type: 'bar',
                        stack: 'total',
                        data: mockData.map(item => item.pipeline),
                        itemStyle: { color: '#3B7AF7' },
                        barWidth: 18
                    },
                    {
                        name: 'Model',
                        type: 'bar',
                        stack: 'total',
                        data: mockData.map(item => item.model),
                        itemStyle: { color: '#2EC291' },
                        barWidth: 18
                    }
                ]
            };

            myChart.setOption(option);
        }
    }, [isLoading, pipelines, selectedTimeOption, pipelineTriggersSummary]);

    return (
        <div className="inline-flex w-full flex-col items-start justify-start rounded-sm bg-semantic-bg-primary shadow">
            <div className="flex flex-col items-start justify-start gap-[30px] self-stretch">
                <div className="inline-flex items-center justify-between gap-2.5 self-stretch pt-8 px-8">
                    <div className="flex items-center justify-start gap-2.5">
                        <div className="text-semantic-fg-primary product-headings-heading-2">
                            Total Credit Trend
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
                                                    Total Credit Trend
                                                </div>
                                                <div className="self-stretch text-semantic-fg-secondary product-body-text-4-medium">
                                                    View the trend of total credit usage for pipelines and models over time.
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
                        View more details
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