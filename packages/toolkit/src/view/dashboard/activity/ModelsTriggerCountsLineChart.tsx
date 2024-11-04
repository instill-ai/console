"use client";

import * as React from "react";
import * as echarts from "echarts";
import { ModelTriggersStatusSummary, ModelTriggerTableRecord, Nullable } from "instill-sdk";
import { Icons, SelectOption, Tooltip } from "@instill-ai/design-system";
import { generateModelTriggerChartRecordData } from "../../../lib";
import { ModelTriggersSummary } from "./ModelTriggersSummary";

type ModelsTriggerCountsLineChartProps = {
  models: ModelTriggerTableRecord[];
  isLoading: boolean;
  selectedTimeOption: SelectOption;
  modelTriggersSummary: Nullable<ModelTriggersStatusSummary>;
};

/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
function selectGraph(params: any, myChart: echarts.ECharts): void {
  myChart.dispatchAction({
    type: "legendSelect",
    // legend name
    name: params.name as string,
  });
}

/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
function unselectGraph(params: any, myChart: echarts.ECharts): void {
  for (const legend in params.selected) {
    if (legend !== params.name) {
      myChart.dispatchAction({
        type: "legendUnSelect",
        // legend name
        name: legend,
      });
    }
  }
}

export const ModelsTriggerCountsLineChart = ({
  isLoading,
  models,
  selectedTimeOption,
  modelTriggersSummary,
}: ModelsTriggerCountsLineChartProps) => {
  console.log(models)
  const chartRef = React.useRef<HTMLDivElement>(null);
  const { xAxis, yAxis } = React.useMemo(() =>
    generateModelTriggerChartRecordData(models, selectedTimeOption.value),
    [models, selectedTimeOption.value]
  );

  React.useEffect(() => {
    if (chartRef.current) {
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
        graphic: {
          type: "image",
          style: {
            image: "/images/no-chart-placeholder.svg",
            x: "45%",
            y: "0%",
            width: models.length === 0 ? 225 : 0,
            height: models.length === 0 ? 225 : 0,
          },
        },
        animation: false,
        title: {
          show: models.length === 0,
          textStyle: {
            color: "#1D2433A6",
            fontSize: 14,
            fontWeight: 500,
            fontFamily: "var(--font-ibm-plex-sans)",
            fontStyle: "italic",
          },
          text: isLoading ? "Loading..." : "No models have been triggered yet",
          left: `${isLoading ? "49.5%" : "44.5%"}`,
          bottom: 100,
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
                      All model triggers&nbsp;
                    </span>
                    <span class="Number product-body-text-3-semibold" style="color: var(--semantic-fg-primary); font-size: 14px; line-height: 20px;">${computeTimeDuration}</span>
                  </div>
                </div>
              </div>
            `;
          },
        },
        xAxis: {
          type: "category",
          data: xAxis,
          axisLabel: {
            fontSize: "14px",
            fontFamily: "var(--font-ibm-plex-sans)",
            fontStyle: "normal",
            fontWeight: "500",
            color: "#6B7280",
          },
        },
        yAxis: {
          type: "value",
          minInterval: 1,
          axisLabel: {
            fontSize: "14px",
            fontFamily: "var(--font-ibm-plex-sans)",
            fontStyle: "normal",
            fontWeight: "500",
            color: "#6B7280",
          },
        },
        series: [
          {
            name: "Model Triggers",
            type: "line",
            smooth: true,
            data: yAxis,
            symbol: "circle",
            symbolSize: 8,
            itemStyle: {
              borderColor: "white",
              borderWidth: 2,
            },
          },
        ],
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
  }, [isLoading, xAxis, yAxis, models]);

  return (
    <div className="inline-flex w-full flex-col items-start justify-start rounded-sm bg-semantic-bg-primary shadow">
      <div className="flex flex-col items-start justify-start gap-[30px] self-stretch">
        <div className="inline-flex items-center justify-between gap-2.5 self-stretch pt-8 px-8">
          <div className="flex items-center justify-start gap-2.5">
            <div className="text-semantic-fg-primary product-headings-heading-2">
              Number of model triggers
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
                          Number of triggers
                        </div>
                        <div className="self-stretch text-semantic-fg-secondary product-body-text-4-medium">
                          Select any pipeline from the table below to view the
                          number of model triggers within the last {selectedTimeOption.label}
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
          <ModelTriggersSummary>
            <ModelTriggersSummary.Card
              summary={
                modelTriggersSummary ? modelTriggersSummary.completed : null
              }
            />
            <ModelTriggersSummary.Card
              summary={
                modelTriggersSummary ? modelTriggersSummary.errored : null
              }
            />
          </ModelTriggersSummary>
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
