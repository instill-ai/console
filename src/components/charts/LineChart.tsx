import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { PipelineTrigger } from "@/types";
import {
  formatDateTime,
  formatTriggerCount,
  getPipelinesSeries,
  getPipelinesTriggerCount,
  getPipelinesTriggerTime,
} from "@/lib/dashboard";
import { Icons } from "@instill-ai/design-system";
import { Skeleton } from "../skeleton";
import { FilterByDay, FilterProps } from "../filter/FilterByDay";

type LineChartProps = {
  triggers: PipelineTrigger[];
  isLoading: boolean;
} & FilterProps;

export const LineChart = ({
  triggers,
  isLoading,
  selectedTimeOption,
  setSelectedTimeOption,
  refetch,
}: LineChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const pipelinesTriggerCount = formatTriggerCount(triggers);
  const xAxisData = getPipelinesTriggerTime(triggers);
  const seriesData = getPipelinesSeries(pipelinesTriggerCount);

  useEffect(() => {
    if (chartRef.current && !isLoading) {
      const myChart = echarts.init(chartRef.current); // eslint-disable-line
      const option = {
        tooltip: {
          trigger: "item",
          tiggerOn: "click",
          formatter: function (params: any) {
            // console.log("params", params);
            const trigger_time = params.name;
            const pipeline_id = params.seriesName;
            const compute_time_duration = params.value;
            return `
              <div class="Content" style="padding: 5px; background: white; border-radius: 4px; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: inline-flex">
                <div class="TextAndSupportingText" style="border-radius: 8px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                  <div class="Date" style="color: rgba(29, 36, 51, 0.65); font-size: 12px;  line-height: 16px; word-wrap: break-word">${trigger_time}</div>
                  <div class="Data1" style="justify-content: flex-start; align-items: center; gap: 4px; display: inline-flex">
                    <div class="Dot" style="width: 10px; height: 10px; position: relative">
                      <div class="Dot" style="width: 8px; height: 8px; left: 1px; top: 1px; position: absolute; background: ${params.color}; border-radius: 9999px"></div>
                    </div>
                    <div class="PipelineId" style="height: 22px; color: rgba(29, 36, 51, 0.80); font-size: 14px;  line-height: 20px; word-wrap: break-word; overflow-wrap: break-word;">
                      ${pipeline_id}
                    </div>
                  </div>
                  <div class="Data2" style="justify-content: flex-start; align-items: flex-start; gap: 4px; display: inline-flex">
                    <div class="TriggerNumber" style="color: rgba(29, 36, 51, 0.80); font-size: 14px;  font-weight: 400; line-height: 20px; word-wrap: break-word">Triggers: </div>
                    <div class="Number" style="color: #1D2433; font-size: 14px;  font-weight: 600; line-height: 20px; word-wrap: break-word">${compute_time_duration}</div>
                  </div>
                </div>
              </div>
            `;
          },
        },
        legend: {
          data: pipelinesTriggerCount.map((pipeline) => pipeline.pipeline_id),
        },
        xAxis: {
          type: "category",
          data: xAxisData,
        },
        yAxis: {
          type: "value",
        },
        series: seriesData,
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
            <>
              {triggers.length ? (
                <div
                  id="main"
                  ref={chartRef}
                  style={{ width: "100%", height: "400px" }}
                />
              ) : (
                <div className="flex h-80 items-center justify-center p-8">
                  <h3 className="text-instillGrey80 text-instill-h3">
                    No Pipelines Found
                  </h3>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
