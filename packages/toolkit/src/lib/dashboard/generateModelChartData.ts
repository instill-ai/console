import { ModelsChart } from "../vdp-sdk";
import { formatDateTime } from "./formatDateTime";
import { getDateRange } from "./getDateRange";
import { sortByDate } from "./sortByDate";

export function generateModelChartData(
  apiResponse: ModelsChart[],
  range: string,
): { xAxis: string[]; yAxis: number[][] } {
  const modelData = apiResponse;

  // Preprocess and format time bucket dates
  const formattedTimeBuckets: string[][] = modelData.map((model) => {
    return model.timeBuckets.map((bucket) => formatDateTime(bucket, range));
  });

  const xAxisSortedDates = sortByDate([
    ...getDateRange(range),
    ...formattedTimeBuckets.flat(),
  ]);

  const xAxis = Array.from(new Set(xAxisSortedDates));

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const yAxis: any = [];

  // Initialize yAxis arrays for each model
  for (const model of modelData) {
    const triggerCounts = {
      name: model.modelId,
      type: "line",
      smooth: true,
      data: new Array(xAxis.length).fill(0),
    };

    yAxis.push(triggerCounts);
  }

  modelData.forEach((model, modelIndex) => {
    const buckets = formattedTimeBuckets[modelIndex];

    if (buckets) {
      for (const [bucketIndex, formattedBucket] of buckets.entries()) {
        const xAxisIndex = xAxis.findIndex((date) => date === formattedBucket);
        if (xAxisIndex !== -1) {
          if (yAxis[modelIndex]["data"][xAxisIndex]) {
            yAxis[modelIndex]["data"][xAxisIndex] +=
              model.triggerCounts[bucketIndex];
          } else {
            yAxis[modelIndex]["data"][xAxisIndex] +=
              model.triggerCounts[bucketIndex];
          }
        }
      }
    }
  });

  return { xAxis, yAxis };
}
