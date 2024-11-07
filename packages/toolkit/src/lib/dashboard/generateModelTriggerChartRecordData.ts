import { ModelTriggerTableRecord } from "instill-sdk";

import { getDateRange } from "./getDateRange";
import { sortByDate } from "./sortByDate";

export function generateModelTriggerChartRecordData(
  apiResponse: ModelTriggerTableRecord[],
  range: string,
): { xAxis: string[]; yAxis: number[] } {
  if (apiResponse.length === 0) {
    return { xAxis: [], yAxis: [] };
  }

  // Assert that model is not undefined
  const model = apiResponse[0]!;

  // Provide a default empty array if timeBuckets is undefined
  const timeBuckets = model.timeBuckets ?? [];

  // Format the time buckets
  const normalizedTimeBuckets = timeBuckets.map((bucket) => bucket);

  // Sort and deduplicate xAxis
  const xAxisSortedDates = sortByDate([
    ...getDateRange(range),
    ...normalizedTimeBuckets,
  ]);

  const xAxis = Array.from(new Set(xAxisSortedDates));

  // Initialize yAxis with zeros
  const yAxis = new Array(xAxis.length).fill(0);

  // Populate yAxis with trigger counts
  timeBuckets.forEach((bucket, index) => {
    const xAxisIndex = xAxis.findIndex((date) => date === bucket);
    if (xAxisIndex !== -1) {
      yAxis[xAxisIndex] += model.triggerCounts?.[index] ?? 0;
    }
  });

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
    yAxis,
  };
}
