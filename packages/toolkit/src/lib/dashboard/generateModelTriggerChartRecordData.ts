import { ModelTriggerChartRecord } from "instill-sdk";

import { formatDateTime } from "./formatDateTime";
import { getDateRange } from "./getDateRange";
import { sortByDate } from "./sortByDate";

export function generateModelTriggerChartRecordData(
  apiResponse: ModelTriggerChartRecord[],
  range: string,
): { xAxis: string[]; yAxis: number[][] } {
  const modelData = apiResponse;

  // Preprocess and format time bucket dates
  const formattedTimeBuckets: string[][] = modelData.map((model) => {
    if (model.timeBuckets) {
      return model.timeBuckets.map((bucket) => formatDateTime(bucket, range));
    }
    return [];
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
              model.triggerCounts?.[bucketIndex] ?? 0;
          } else {
            yAxis[modelIndex]["data"][xAxisIndex] +=
              model.triggerCounts?.[bucketIndex] ?? 0;
          }
        }
      }
    }
  });

  return { xAxis, yAxis };
}
