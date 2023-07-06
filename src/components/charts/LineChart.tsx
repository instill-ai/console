import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { PipelineTrigger } from "@/types";
import {
  formatDateTime,
  getPipelinesSeries,
  getPipelinesTriggerCount,
  getPipelinesTriggerTime,
} from "@/lib/dashboard";
import { Icons } from "@instill-ai/design-system";
import { Skeleton } from "../skeleton";
import { FilterByDay, FilterProps } from "../filter/FilterByDay";

type LineChartProps = {
  pipelines: PipelineTrigger[];
  isLoading: boolean;
} & FilterProps;

export const LineChart = ({
  pipelines,
  isLoading,
  selectedTimeOption,
  setSelectedTimeOption,
  refetch,
}: LineChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const xAxisData = pipelines?.map((pipeline) =>
    formatDateTime(pipeline.trigger_time)
  );
  const seriesData = pipelines?.map((pipeline) => {
    return {
      name: pipeline.pipeline_id,
      value: pipeline.compute_time_duration,
    };
  });

  useEffect(() => {
    if (chartRef.current && !isLoading) {
      const myChart = echarts.init(chartRef.current); // eslint-disable-line
      const option = {
        tooltip: {
          trigger: "axis",
          // triggerOn: "click",
          formatter: (params: any) => {
            const trigger_time = params[0].axisValue;
            const pipeline_id = params[0].seriesName;
            const compute_time_duration = params[0].value;
            return `Time: ${trigger_time}<br /> Pipeline: ${pipeline_id}<br />Compute Time: ${compute_time_duration} Sec<br />`;
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
  }, [isLoading]);

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

          <FilterByDay
            refetch={refetch}
            selectedTimeOption={selectedTimeOption}
            setSelectedTimeOption={setSelectedTimeOption}
          />
        </div>
        <div className="Chart relative self-stretch">
          {isLoading ? (
            <Skeleton
              width="w-full"
              hight="h-96"
              classname="p-8"
              animationHeight="h-80"
            />
          ) : (
            <div
              id="main"
              ref={chartRef}
              style={{ width: "100%", height: "400px" }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
