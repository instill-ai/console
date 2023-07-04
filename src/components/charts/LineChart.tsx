import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { PipelineTrigger } from "@/types";
import {
  formatDateTime,
  getPipelinesSeries,
  getPipelinesTriggerCount,
  getPipelinesTriggerTime,
  timeLineOptions,
} from "@/lib/dashboard";
import { Icons, SingleSelectOption } from "@instill-ai/design-system";
import { Nullable } from "@instill-ai/toolkit";
import cn from "clsx";

type LineChartProps = {
  pipelines: PipelineTrigger[];
};

export const LineChart = ({ pipelines }: LineChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const [selectedTimeOption, setSelectedTimeOption] = React.useState<
    Nullable<SingleSelectOption>
  >({
    label: "Today",
    value: "24h",
  });

  const xAxisData = pipelines?.map((pipeline) =>
    formatDateTime(pipeline.trigger_time)
  );
  const seriesData = pipelines?.map((pipeline) => {
    return {
      name: pipeline.pipeline_name,
      value: pipeline.compute_time_duration,
    };
  });

  useEffect(() => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current); // eslint-disable-line
      const option = {
        tooltip: {
          trigger: "axis",
          // triggerOn: "click",
          formatter: (params: any) => {
            console.log("params", params);

            const trigger_time = params[0].axisValue;
            const pipeline_name = params[0].data.name;
            const compute_time_duration = params[0].data.value;
            return `Time: ${trigger_time}<br /> Pipeline: ${pipeline_name}<br />Compute Time: ${compute_time_duration} Sec<br />`;
          },
        },
        xAxis: {
          type: "category",
          data: getPipelinesTriggerTime(pipelines),
        },
        yAxis: {
          type: "value",
        },
        series: getPipelinesSeries(getPipelinesTriggerCount(pipelines)),
      };
      myChart.setOption(option);
    }
  }, []);

  return (
    <div className="TriggersChart inline-flex w-full flex-col items-start justify-start rounded-sm bg-white shadow">
      <div className="Frame7 flex flex-col items-start justify-start gap-[30px] self-stretch">
        <div className="CardHeader inline-flex items-center justify-start gap-2.5 self-stretch p-8">
          <div className="LeftContent flex items-center justify-start gap-2.5">
            <div className="NumberOfTriggers text-[22px] font-semibold leading-7 text-gray-800">
              Number of triggers
            </div>
            <div className="AlertCircle relative h-6 w-6">
              <Icons.HelpCircle className="h-6 w-6 stroke-semantic-fg-primary" />
            </div>
          </div>
          <div className="RightContent shrink grow basis-0 px-2.5" />
          <div className="IconButton flex items-center justify-center rounded border border-slate-200 bg-white p-2">
            <Icons.Plus className="h-4 w-4 stroke-semantic-fg-primary" />
          </div>
          <div className="ButtonGroup flex items-start justify-start gap-[1px] border border-slate-200 bg-slate-200">
            {timeLineOptions.map((timeLineOption) => (
              <div
                key={timeLineOption.value}
                className={cn(
                  `Button flex w-[66px] cursor-pointer items-center justify-center gap-1 self-stretch ${
                    timeLineOption.value === selectedTimeOption?.value
                      ? "bg-slate-200"
                      : "bg-white"
                  } px-4 py-1`
                )}
                onClick={() => {
                  setSelectedTimeOption(timeLineOption);
                }}
              >
                <div className="Label text-center text-[12px] font-semibold leading-none text-gray-800">
                  {timeLineOption.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="Chart relative self-stretch">
          <div
            id="main"
            ref={chartRef}
            style={{ width: "100%", height: "400px" }}
          />
        </div>
      </div>
    </div>
  );
};
