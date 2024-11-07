import { PipelinesChart } from "instill-sdk";

import { getDateRange } from "./getDateRange";
import { sortByDate } from "./sortByDate";

export type YAxisData = {
  name: string;
  type: string;
  smooth: boolean;
  data: number[];
};

export function generatePipelineChartData(
  chart: PipelinesChart[],
  range: string,
): { xAxis: string[]; yAxis: YAxisData[] } {
  // Preprocess and format time bucket dates
  const normalizedTimeBuckets: string[][] = chart.map((pipeline) => {
    return pipeline.timeBuckets.map((bucket) => bucket);
  });

  const xAxisSortedDates = sortByDate([
    ...getDateRange(range),
    ...normalizedTimeBuckets.flat(),
  ]);

  console.log("xAxisSortedDates", xAxisSortedDates);

  const xAxis = Array.from(new Set(xAxisSortedDates));

  const accumulatedTriggerCounts = new Array(xAxis.length).fill(0);

  // Accumulate trigger counts
  for (const pipeline of chart) {
    for (const [bucketIndex, bucket] of pipeline.timeBuckets.entries()) {
      const xAxisIndex = xAxis.findIndex((date) => date === bucket);
      if (xAxisIndex !== -1) {
        accumulatedTriggerCounts[xAxisIndex] +=
          pipeline.triggerCounts[bucketIndex];
      }
    }
  }

  console.log("accumulatedTriggerCounts", accumulatedTriggerCounts);

  return {
    xAxis: xAxis.map((x) =>
      range === "24h"
        ? new Date(x).toLocaleString("en-US", {
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })
        : new Date(x).toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
          }),
    ),
    yAxis: [
      {
        name: "allPipelineTrigger",
        type: "line",
        smooth: true,
        data: accumulatedTriggerCounts,
      },
    ],
  };
}
