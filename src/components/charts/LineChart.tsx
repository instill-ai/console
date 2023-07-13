import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { PipelineTriggerCount } from "@/types";
import { getPipelinesSeries, getPipelinesTriggerTime } from "@/lib/dashboard";
import { Icons, Tooltip } from "@instill-ai/design-system";
import { Skeleton } from "../skeleton";

type LineChartProps = {
  pipelines: PipelineTriggerCount[];
  isLoading: boolean;
};

export const LineChart = ({ isLoading, pipelines }: LineChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const xAxisData = getPipelinesTriggerTime(pipelines);
  const seriesData = getPipelinesSeries(pipelines);

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
          data: pipelines.map((pipeline) => pipeline.pipeline_id),
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
  }, [isLoading, xAxisData, seriesData, pipelines]);

  return (
    <div className="TriggersChart inline-flex w-full flex-col items-start justify-start rounded-sm bg-white shadow">
      <div className="Frame7 flex flex-col items-start justify-start gap-[30px] self-stretch">
        <div className="CardHeader inline-flex items-center justify-start gap-2.5 self-stretch p-8">
          <div className="LeftContent flex items-center justify-start gap-2.5">
            <div className="NumberOfTriggers text-[22px] font-semibold leading-7 text-gray-800">
              Number of triggers
            </div>
            {/* Tooltip about the chart */}
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <div className="AlertCircle relative h-6 w-6">
                    <Icons.HelpCircle className="h-6 w-6 stroke-semantic-fg-primary" />
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="TooltipContent rounded-sm"
                    sideOffset={5}
                    side={"right"}
                  >
                    <div className="Content inline-flex w-80 flex-col items-start justify-start rounded-sm bg-white p-3">
                      <div className="TextAndSupportingText flex flex-col items-start justify-start gap-1 self-stretch">
                        <div className="Text self-stretch text-sm font-semibold leading-none text-gray-800">
                          Number of triggers tooltip
                        </div>
                        <div className="SupportingText self-stretch text-sm font-medium leading-none text-gray-800 text-opacity-80">
                          Select any pipeline from the table below to view the
                          number of pipeline triggers within the last 7 days.
                        </div>
                      </div>
                    </div>
                    <Tooltip.Arrow
                      className="fill-white"
                      offset={10}
                      width={18}
                      height={12}
                    />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        </div>
        <div className="Chart relative self-stretch">
          {isLoading ? (
            <Skeleton
              width="w-full"
              hight="h-96"
              classname="p-8"
              animationHeight="h-80 rounded"
            />
          ) : (
            <>
              {pipelines.length ? (
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
