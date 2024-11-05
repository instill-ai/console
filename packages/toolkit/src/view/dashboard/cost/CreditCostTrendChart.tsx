"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

import {
  Icons,
  Skeleton,
  Tooltip as TooltipDS,
} from "@instill-ai/design-system";

type CreditCostTrendChartProps = {
  dates: string[];
  values: number[];
  isLoading: boolean;
  type: "model" | "pipeline";
  xAxisFormat: "date" | "hour";
};

export const CreditCostTrendChart = ({
  dates,
  values,
  isLoading,
  type,
  xAxisFormat,
}: CreditCostTrendChartProps) => {
  const chartColor = type === "model" ? "#2EC291" : "#3B7AF7";

  const data = React.useMemo(() => {
    return dates.map((date, index) => ({
      date,
      value: values[index] ?? 0,
    }));
  }, [dates, values]);

  const formatXAxis = (value: string) => {
    const date = new Date(value);
    if (xAxisFormat === "hour") {
      return `${date.getHours()}:00`;
    } else {
      return `${date.getDate()} ${date.toLocaleString("default", {
        month: "short",
      })}`;
    }
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (!active || !payload || !payload.length) return null;

    const date = new Date(label);
    const formattedDate =
      xAxisFormat === "hour"
        ? `${date.getHours()}:00 - ${date.getFullYear()}`
        : `${date.getDate()} ${date.toLocaleString("default", {
            month: "short",
          })}, ${date.getFullYear()} - ${date.toTimeString().split(" ")[0]}`;

    return (
      <div className="rounded-sm bg-white p-3 shadow">
        <p className="mb-1 text-semantic-fg-disabled product-body-text-4-medium">
          {formattedDate}
        </p>
        <div className="flex items-center gap-2">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: chartColor }}
          />
          <p className="text-semantic-fg-primary product-body-text-3-medium">
            {(payload[0]?.value ?? 0).toFixed(2)} credits
          </p>
        </div>
      </div>
    );
  };

  const LoadingSkeleton = () => (
    <div className="w-full h-[400px] flex flex-col justify-between relative">
      <div className="absolute left-8 h-full flex flex-col justify-between py-8">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="flex items-end justify-between w-full h-full pl-16 space-x-12">
        <Skeleton className="w-6 h-[60%] rounded-t-sm rounded-b-none" />
        <Skeleton className="w-6 h-[80%] rounded-t-sm rounded-b-none" />
        <Skeleton className="w-6 h-[40%] rounded-t-sm rounded-b-none" />
        <Skeleton className="w-6 h-[70%] rounded-t-sm rounded-b-none" />
        <Skeleton className="w-6 h-[55%] rounded-t-sm rounded-b-none" />
        <Skeleton className="w-6 h-[65%] rounded-t-sm rounded-b-none" />
        <Skeleton className="w-6 h-[45%] rounded-t-sm rounded-b-none" />
      </div>
      <div className="flex justify-between w-full pl-16 pt-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );

  return (
    <div className="inline-flex w-full flex-col items-start justify-start rounded-sm bg-semantic-bg-primary shadow">
      <div className="flex flex-col items-start justify-start gap-[30px] self-stretch">
        <div className="inline-flex items-center justify-between gap-2.5 self-stretch pt-8 px-8">
          <div className="flex items-center justify-start gap-2.5">
            <div className="text-semantic-fg-primary product-headings-heading-2">
              Credit Cost Trend
            </div>
            <TooltipDS.Provider>
              <TooltipDS.Root>
                <TooltipDS.Trigger asChild>
                  <div className="relative h-4 w-4">
                    <Icons.AlertCircle className="h-4 w-4 stroke-semantic-fg-primary" />
                  </div>
                </TooltipDS.Trigger>
                <TooltipDS.Portal>
                  <TooltipDS.Content
                    className="rounded-sm"
                    sideOffset={5}
                    side="right"
                  >
                    <div className="inline-flex w-80 flex-col items-start justify-start rounded-sm bg-semantic-bg-primary p-3">
                      <div className="flex flex-col items-start justify-start gap-1 self-stretch">
                        <div className="self-stretch text-semantic-fg-primary product-body-text-4-semibold">
                          Credit Cost Trend
                        </div>
                        <div className="self-stretch text-semantic-fg-secondary product-body-text-4-medium">
                          View the trend of credit cost for {type}s over time.
                        </div>
                      </div>
                    </div>
                    <TooltipDS.Arrow
                      className="fill-semantic-bg-primary"
                      offset={10}
                      width={9}
                      height={6}
                    />
                  </TooltipDS.Content>
                </TooltipDS.Portal>
              </TooltipDS.Root>
            </TooltipDS.Provider>
          </div>
          <Link
            className="text-semantic-fg-secondary product-button-button-2 px-3 py-1 border border-semantic-fg-disabled rounded-full"
            href={`/settings/billing/credits`}
          >
            View billing details
          </Link>
        </div>
        <div className="px-8 pb-8 w-full" style={{ height: "460px" }}>
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatXAxis}
                  tickLine={false}
                  stroke="#6B7280"
                  tick={{
                    fontSize: "10px",
                    fontFamily: "var(--font-ibm-plex-sans)",
                    fontStyle: "normal",
                    fontWeight: "500",
                    color: "#6B7280",
                  }}
                />
                <YAxis
                  tickLine={false}
                  stroke="#6B7280"
                  domain={[0, "auto"]}
                  allowDecimals={false}
                  label={{
                    value: "Credits",
                    angle: -90,
                    position: "insideLeft",
                  }}
                  tick={{
                    fontSize: "10px",
                    fontFamily: "var(--font-ibm-plex-sans)",
                    fontStyle: "normal",
                    fontWeight: "500",
                    color: "#6B7280",
                  }}
                />
                <Tooltip
                  content={CustomTooltip}
                  cursor={{ fill: "transparent" }}
                />
                <Bar
                  dataKey="value"
                  fill={chartColor}
                  barSize={24}
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};
