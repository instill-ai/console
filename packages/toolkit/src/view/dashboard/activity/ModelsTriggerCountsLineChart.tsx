"use client";

import * as React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Icons, SelectOption, Tooltip as InstillTooltip } from "@instill-ai/design-system";
import { generateModelTriggerChartRecordData } from "../../../lib";
import { ModelTriggersSummary } from "./ModelTriggersSummary";
import {
  ModelTriggersStatusSummary,
  ModelTriggerTableRecord,
  Nullable,
} from "instill-sdk";

type ModelsTriggerCountsLineChartProps = {
  models: ModelTriggerTableRecord[];
  isLoading: boolean;
  selectedTimeOption: SelectOption;
  modelTriggersSummary: Nullable<ModelTriggersStatusSummary>;
};

export const ModelsTriggerCountsLineChart = ({
  isLoading,
  models,
  selectedTimeOption,
  modelTriggersSummary,
}: ModelsTriggerCountsLineChartProps) => {
  const { xAxis, yAxis } = React.useMemo(
    () => generateModelTriggerChartRecordData(models, selectedTimeOption.value),
    [models, selectedTimeOption.value]
  );

  const chartData = React.useMemo(() => {
    return xAxis.map((date, index) => ({
      name: date,
      value: yAxis[index] || 0,
    }));
  }, [xAxis, yAxis]);

  return (
    <div className="inline-flex w-full flex-col items-start justify-start rounded-sm bg-semantic-bg-primary shadow">
      <div className="flex flex-col items-start justify-start gap-[30px] self-stretch">
        <div className="inline-flex items-center justify-between gap-2.5 self-stretch pt-8 px-8">
          <div className="flex items-center justify-start gap-2.5">
            <div className="text-semantic-fg-primary product-headings-heading-2">
              Number of model triggers
            </div>
            <InstillTooltip.Provider>
              <InstillTooltip.Root>
                <InstillTooltip.Trigger asChild>
                  <div className="relative h-4 w-4">
                    <Icons.AlertCircle className="h-4 w-4 stroke-semantic-fg-primary" />
                  </div>
                </InstillTooltip.Trigger>
                <InstillTooltip.Portal>
                  <InstillTooltip.Content
                    className="rounded-sm"
                    sideOffset={5}
                    side="right"
                  >
                    <div className="inline-flex w-80 flex-col items-start justify-start rounded-sm bg-semantic-bg-primary p-3">
                      <div className="flex flex-col items-start justify-start gap-1 self-stretch">
                        <div className="self-stretch text-semantic-fg-primary product-body-text-4-semibold">
                          Number of triggers
                        </div>
                        <div className="self-stretch text-semantic-fg-secondary product-body-text-4-medium">
                          Select any pipeline from the table below to view the
                          number of model triggers within the last{" "}
                          {selectedTimeOption.label}
                        </div>
                      </div>
                    </div>
                    <InstillTooltip.Arrow
                      className="fill-semantic-bg-primary"
                      offset={10}
                      width={9}
                      height={6}
                    />
                  </InstillTooltip.Content>
                </InstillTooltip.Portal>
              </InstillTooltip.Root>
            </InstillTooltip.Provider>
          </div>
        </div>

        <div className="px-8 pb-8 w-full">
          <ModelTriggersSummary>
            <ModelTriggersSummary.Card
              summary={modelTriggersSummary?.completed ?? null}
            />
            <ModelTriggersSummary.Card
              summary={modelTriggersSummary?.errored ?? null}
            />
          </ModelTriggersSummary>
        </div>

        <div className="w-full h-[400px]">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center text-semantic-fg-disabled italic">
              Loading...
            </div>
          ) : models.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <img
                src="/images/no-chart-placeholder.svg"
                alt="No data"
                className="w-56 h-56"
              />
              <p className="text-semantic-fg-disabled italic mt-4">
                No models have been triggered yet
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 10,
                    fontFamily: "var(--font-ibm-plex-sans)",
                    fill: "#6B7280",
                  }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fontSize: 10,
                    fontFamily: "var(--font-ibm-plex-sans)",
                    fill: "#6B7280",
                  }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                  allowDecimals={false}
                  interval="preserveStart"
                />
                <Tooltip
                  trigger="click"
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "5px",
                  }}
                  formatter={(value: number, name: string) => {
                    return [
                      <div key={name} style={{ padding: "5px" }}>
                        <div style={{ color: "var(--semantic-fg-disabled)", fontSize: "12px", lineHeight: "16px" }}>
                          {name}
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span style={{ color: "var(--semantic-fg-secondary)", fontSize: "14px", lineHeight: "20px" }}>
                            All model triggers&nbsp;
                          </span>
                          <span style={{ color: "var(--semantic-fg-primary)", fontSize: "14px", lineHeight: "20px", fontWeight: 600 }}>
                            {value}
                          </span>
                        </div>
                      </div>
                    ];
                  }}
                />
                <Line
                  type="linear"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{
                    r: 4,
                    strokeWidth: 2,
                    fill: "white",
                    stroke: "#3B82F6",
                  }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};