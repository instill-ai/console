import { ModelTriggerTableRecord } from "instill-sdk";
import { formatDateTime } from "./formatDateTime";
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
  const formattedTimeBuckets = timeBuckets.map(bucket => formatDateTime(bucket, range));

  // Sort and deduplicate xAxis
  const xAxisSortedDates = sortByDate([...getDateRange(range), ...formattedTimeBuckets]);
  const xAxis = Array.from(new Set(xAxisSortedDates));

  // Initialize yAxis with zeros
  const yAxis = new Array(xAxis.length).fill(0);

  // Populate yAxis with trigger counts
  timeBuckets.forEach((bucket, index) => {
    const formattedBucket = formatDateTime(bucket, range);
    const xAxisIndex = xAxis.findIndex(date => date === formattedBucket);
    if (xAxisIndex !== -1) {
      yAxis[xAxisIndex] += model.triggerCounts?.[index] ?? 0;
    }
  });

  return { xAxis, yAxis };
}
