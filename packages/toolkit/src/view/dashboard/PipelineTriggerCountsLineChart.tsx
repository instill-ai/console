import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { Icons, SelectOption, Tooltip } from "@instill-ai/design-system";
import { PipelinesChart, generateChartData } from "../../lib";

type PipelineTriggerCountsLineChartProps = {
  pipelines: PipelinesChart[];
  isLoading: boolean;
  selectedTimeOption: SelectOption;
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

  const xAxisData = xAxis;
  const seriesData = yAxis;

  useEffect(() => {
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
            width: pipelines.length === 0 ? 225 : 0,
            height: pipelines.length === 0 ? 225 : 0,
          },
        },
        animation: false,
        title: {
          show: pipelines.length === 0,
          textStyle: {
            color: "#1D2433A6",
            fontSize: 14,
            fontWeight: 500,
            fontFamily: "IBM Plex Mono",
            fontStyle: "italic",
          },
          text: isLoading
            ? "Loading..."
            : "No pipelines have been triggered yet",
          left: "center",
          bottom: 100,
        },
        tooltip: {
          trigger: "item",
          tiggerOn: "click",

          /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
          formatter: function (params: any) {
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
        // legend: {
        //   data: pipelines.map((pipeline) => pipeline.pipeline_id),
        // },
        xAxis: {
          type: "category",
          data: xAxisData,
          axisLabel: {
            fontSize: "14px",
            fontFamily: "Inter",
            fontStyle: "normal",
            fontWeight: "600",
            color: "#6B7280",
          },
        },
        yAxis: {
          type: "value",
          minInterval: 1,
          axisLabel: {
            fontSize: "14px",
            fontFamily: "Inter",
            fontStyle: "normal",
            fontWeight: "600",
            color: "#6B7280",
          },
        },
        series: seriesData,
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
                      width={9}
                      height={6}
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
          style={{ width: "100%", height: "400px", paddingLeft: "0px" }}
          className="!p-0"
        />
      </div>
    </div>
  );
};
