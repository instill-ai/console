import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { Icons, SingleSelectOption, Tooltip } from "@instill-ai/design-system";
import {
  PipelineTriggerCount,
  formatDateTime,
  getDateRange,
  getPipelinesSeries,
  xAxisRange,
} from "@instill-ai/toolkit";
import { PipelinesChart } from "@/lib/dashboard";

export type yAxisData = {
  name: string;
  type: string;
  smooth: boolean;
  data: number[] | string[];
};

type PipelineTriggerCountsLineChartProps = {
  pipelines: PipelinesChart[];
  isLoading: boolean;
  selectedTimeOption: SingleSelectOption;
};

// Update the path accordingly

export type MyDate = {
  date: Date;
  dateString: string;
};

export function sortByDate(dateArray: string[]) {
  const parsedArray: MyDate[] = dateArray.map((dateString) => ({
    date: new Date(dateString),
    dateString: dateString,
  }));

  return parsedArray
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((date) => date.dateString);
}

export function generateChartData(
  apiResponse: PipelinesChart[],
  range: string
): { xAxis: string[]; yAxis: number[][] } {
  const pipelineData = apiResponse;

  // Preprocess and format time bucket dates
  const formattedTimeBuckets: string[][] = pipelineData.map((pipeline) => {
    return pipeline.time_buckets.map((bucket) => formatDateTime(bucket, range));
  });

  const xAxis = sortByDate([
    ...getDateRange(range),
    ...formattedTimeBuckets.flat(),
  ]);
  const yAxis: any = [];

  // Initialize yAxis arrays for each pipeline
  for (const pipeline of pipelineData) {
    const triggerCounts = {
      name: pipeline.pipeline_id,
      type: "line",
      smooth: true,
      data: new Array(xAxis.length).fill(0),
    };

    yAxis.push(triggerCounts);
  }

  pipelineData.forEach((pipeline, pipelineIndex) => {
    for (const [bucketIndex, formattedBucket] of formattedTimeBuckets[
      pipelineIndex
    ].entries()) {
      const xAxisIndex = xAxis.findIndex((date) => date === formattedBucket);
      if (xAxisIndex !== -1) {
        yAxis[pipelineIndex]["data"][xAxisIndex] =
          pipeline.trigger_counts[bucketIndex];
      }
    }
  });

  return { xAxis, yAxis };
}

export const PipelineTriggerCountsLineChart = ({
  isLoading,
  pipelines,
  selectedTimeOption,
}: PipelineTriggerCountsLineChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const { xAxis, yAxis } = generateChartData(
    pipelines,
    selectedTimeOption.value
  );
  // const xAxisData = xAxisRange(pipelines, selectedTimeOption.value);
  const xAxisData = xAxis;
  // const seriesData = getPipelinesSeries(pipelines);
  const seriesData = yAxis;

  useEffect(() => {
    if (chartRef.current) {
      // Dispose the previous chart instance
      echarts.dispose(chartRef.current); // eslint-disable-line
      const myChart = echarts.init(chartRef.current); // eslint-disable-line
      const option = {
        title: {
          show: pipelines.length === 0,
          textStyle: {
            color: "#1D2433",
            fontSize: 22,
            fontWeight: 500,
          },
          text: isLoading ? "Loading..." : "No Piplelines",
          left: "center",
          top: 100,
        },
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
          minInterval: 1,
        },
        series: seriesData,
      };

      myChart.setOption(option, true);
    }
  }, [isLoading, xAxisData, seriesData, pipelines]);

  return (
    <div className="inline-flex w-full flex-col items-start justify-start rounded-sm bg-semantic-bg-primary shadow">
      <div className="flex flex-col items-start justify-start gap-[30px] self-stretch">
        <div className="inline-flex items-center justify-start gap-2.5 self-stretch p-8">
          <div className="flex items-center justify-start gap-2.5">
            <div className="text-semantic-fg-primary product-headings-heading-2">
              Number of triggers
            </div>
            {/* Tooltip about the chart */}
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <div className="relative h-6 w-6">
                    <Icons.HelpCircle className="h-6 w-6 stroke-semantic-fg-primary" />
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
                          Number of triggers tooltip
                        </div>
                        <div className="self-stretch text-semantic-fg-secondary product-body-text-4-medium">
                          Select any pipeline from the table below to view the
                          number of pipeline triggers within the last 7 days.
                        </div>
                      </div>
                    </div>
                    <Tooltip.Arrow
                      className="fill-semantic-bg-primary"
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
        <div
          id="main"
          ref={chartRef}
          style={{ width: "100%", height: "400px" }}
        />
      </div>
    </div>
  );
};
