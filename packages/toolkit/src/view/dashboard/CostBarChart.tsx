"use client";

import * as React from 'react';
import * as echarts from "echarts";
import { PipelinesChart, PipelineTriggersStatusSummary } from '../../lib';
import { SelectOption } from '@instill-ai/design-system';
import { Nullable } from 'instill-sdk';

type CostBarChartProps = {
    isLoading: boolean;
    pipelines: PipelinesChart[];
    selectedTimeOption: SelectOption;
    pipelineTriggersSummary: Nullable<PipelineTriggersStatusSummary>;
    costView: "model" | "pipeline";
};

export const CostBarChart = ({
    isLoading,
    pipelines,
    selectedTimeOption,
    pipelineTriggersSummary,
    costView,
}: CostBarChartProps) => {
    const chartRef = React.useRef<HTMLDivElement>(null);

    const mockData = [
        { id: 'item1', value: 120, color: '#3B7AF7' },
        { id: 'item2', value: 200, color: '#2EC291' },
        { id: 'item3', value: 150, color: '#3B7AF7' },
        { id: 'item4', value: 80, color: '#2EC291' },
        { id: 'item5', value: 70, color: '#3B7AF7' },
    ];

    React.useEffect(() => {
        if (chartRef.current) {
            const chart = echarts.init(chartRef.current);

            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                xAxis: {
                    type: 'category',
                    data: mockData.map(item => item.id),
                    axisLabel: {
                        interval: 0,
                        rotate: 30
                    }
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: mockData.map(item => ({
                        value: item.value,
                        itemStyle: {
                            color: item.color
                        }
                    })),
                    type: 'bar'
                }]
            };

            chart.setOption(option);

            return () => {
                chart.dispose();
            };
        }
    }, [costView, isLoading, pipelines, selectedTimeOption, pipelineTriggersSummary]);

    return (
        <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
    );
};