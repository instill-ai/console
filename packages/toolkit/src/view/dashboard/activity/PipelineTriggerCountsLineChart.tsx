"use client";

import * as React from "react";
import { Nullable, PipelinesChart } from "instill-sdk";

import { Icons, SelectOption, Tooltip } from "@instill-ai/design-system";

import {
  generatePipelineChartData,
  PipelineTriggersStatusSummary,
} from "../../../lib";
import { PipelineTriggersSummary } from "./PipelineTriggersSummary";

type PipelineTriggerCountsLineChartProps = {
  pipelines: PipelinesChart[];
  isLoading: boolean;
  selectedTimeOption: SelectOption;
  pipelineTriggersSummary: Nullable<PipelineTriggersStatusSummary>;
};

/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
function selectGraph(params: any, myChart: any): void {
  myChart.dispatchAction({
    type: "legendSelect",
    // legend name
    name: params.name as string,
  });
}

/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
function unselectGraph(params: any, myChart: any): void {
  for (const legend in params.selected) {
    if (legend !== params.name) {
      myChart.dispatchAction({
        type: "legendUnSelect",
        name: legend,
      });
    }
  }
}

export const PipelineTriggerCountsLineChart = ({
  isLoading,
  pipelines,
  selectedTimeOption,
  pipelineTriggersSummary,
}: PipelineTriggerCountsLineChartProps) => {
  const chartRef = React.useRef<HTMLDivElement>(null);

  // Dynamic import for ECharts to prevent SSR issues
  const [echarts, setEcharts] = React.useState<typeof import("echarts") | null>(
    null,
  );

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      import("echarts").then((module) => {
        setEcharts(module);
      });
    }
  }, []);

  const { xAxis, yAxis } = generatePipelineChartData(
    pipelines,
    selectedTimeOption.value,
  );

  const xAxisData = xAxis;
  const seriesData = yAxis;
  const showGraph = pipelines.length > 0;

  React.useEffect(() => {
    if (chartRef.current && echarts) {
      // Dispose the previous chart instance
      echarts.dispose(chartRef.current); // eslint-disable-line
      const myChart = echarts.init(chartRef.current, null, {
        renderer: "svg",
      }); // eslint-disable-line
      const option = {
        grid: {
          left: "50px",
          right: "50px",
          top: 10,
          bottom: 50,
        },
        animation: false,
        title: {
          show: pipelines.length === 0,
          textStyle: {
            color: "#1D2433A6",
            fontSize: 14,
            fontWeight: 500,
            fontFamily: "var(--font-ibm-plex-sans)",
            fontStyle: "italic",
          },
          text: isLoading
            ? "Loading..."
            : "No pipelines have been triggered yet",
          left: `${isLoading ? "46%" : "36%"}`,
          top: "47.5%",
        },
        tooltip: {
          trigger: "item",
          tiggerOn: "click",
          backgroundColor: "white",
          borderColor: "transparent",
          textStyle: {
            color: "var(--semantic-fg-primary)",
          },
          /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
          formatter: function (params: any) {
            const triggerTime = params.name;
            const computeTimeDuration = params.value;
            return `
              <div class="Content" style="padding: 5px; background: white; border-radius: 4px; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: inline-flex">
                <div class="TextAndSupportingText" style="border-radius: 8px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                  <div class="Date product-body-text-4-medium" style="color: var(--semantic-fg-disabled); font-size: 12px; line-height: 16px; word-wrap: break-word">${triggerTime}</div>
                  <div style="display: flex; align-items: center; white-space: nowrap;">
                    <span class="PipelineId product-body-text-3-regular" style="color: var(--semantic-fg-secondary); font-size: 14px; line-height: 20px;">
                      All pipeline runs&nbsp;
                    </span>
                    <span class="Number product-body-text-3-semibold" style="color: var(--semantic-fg-primary); font-size: 14px; line-height: 20px;">${computeTimeDuration}</span>
                  </div>
                </div>
              </div>
            `;
          },
        },
        xAxis: {
          show: showGraph,
          type: "category",
          data: xAxisData,
          axisTick: {
            length: 0,
          },
          axisLabel: {
            fontSize: "10px",
            fontFamily: "var(--font-ibm-plex-sans)",
            fontStyle: "normal",
            fontWeight: "500",
            color: "#6B7280",
          },
        },
        yAxis: {
          show: showGraph,
          type: "value",
          minInterval: 1,
          axisTick: {
            length: 0,
          },
          axisLabel: {
            fontSize: "10px",
            fontFamily: "var(--font-ibm-plex-sans)",
            fontStyle: "normal",
            fontWeight: "500",
            color: "#6B7280",
          },
        },
        series: seriesData.map((series) => ({
          ...series,
          symbol: "circle",
          symbolSize: 4,
          itemStyle: {
            borderColor: "white",
            borderWidth: 0,
          },
        })),
        legend: {
          show: false,
          selected: {
            [`${seriesData?.[0]?.name}`]: showGraph,
          },
        },
      };

      myChart.setOption(option, true);

      /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
      myChart.on("legendselectchanged", function (params: any) {
        const selected = Object.values(params.selected);
        if (selected.filter((select) => !select).length === selected.length) {
          myChart.dispatchAction({
            type: "legendAllSelect",
          });
        } else {
          selectGraph(params, myChart);
          unselectGraph(params, myChart);
        }
      });
    }
  }, [isLoading, xAxisData, seriesData, pipelines, echarts]);

  return (
    <div className="inline-flex w-full flex-col items-start justify-start rounded-sm bg-semantic-bg-primary shadow">
      <div className="flex flex-col items-start justify-start gap-[30px] self-stretch">
        <div className="inline-flex items-center justify-between gap-2.5 self-stretch pt-8 px-8">
          <div className="flex items-center justify-start gap-2.5">
            <div className="text-semantic-fg-primary product-headings-heading-2">
              Number of pipeline runs
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
                          Number of pipeline runs
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
        </div>
        {/* Status */}
        <div className="px-8 pb-8 w-full">
          <PipelineTriggersSummary>
            <PipelineTriggersSummary.Card
              summary={
                pipelineTriggersSummary
                  ? pipelineTriggersSummary.completed
                  : null
              }
            />
            <PipelineTriggersSummary.Card
              summary={
                pipelineTriggersSummary ? pipelineTriggersSummary.errored : null
              }
            />
          </PipelineTriggersSummary>
        </div>
        <div
          id="main"
          ref={chartRef}
          style={{ width: "100%", height: "400px", paddingLeft: "0px" }}
          className="!p-0"
        />
      </div>
    </div>
  );
};
