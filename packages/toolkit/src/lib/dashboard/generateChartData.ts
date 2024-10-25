import type { PipelineTriggerChartRecord } from "instill-sdk";

import { formatDateTime } from "./formatDateTime";
import { getDateRange } from "./getDateRange";
import { sortByDate } from "./sortByDate";

export function generateChartData(
  apiResponse: PipelineTriggerChartRecord[],
  range: string,
): { xAxis: string[]; yAxis: number[][] } {
  const pipelineData = apiResponse;

  // Preprocess and format time bucket dates
  const formattedTimeBuckets: string[][] = pipelineData.map((pipeline) => {
    return pipeline.timeBuckets.map((bucket) => formatDateTime(bucket, range));
  });

  const xAxisSortedDates = sortByDate([
    ...getDateRange(range),
    ...formattedTimeBuckets.flat(),
  ]);

  const xAxis = Array.from(new Set(xAxisSortedDates));

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const yAxis: any = [];

  // Initialize yAxis arrays for each pipeline
  for (const pipeline of pipelineData) {
    const triggerCounts = {
      name: pipeline.pipelineId,
      type: "line",
      smooth: true,
      data: new Array(xAxis.length).fill(0),
    };

    yAxis.push(triggerCounts);
  }

  pipelineData.forEach((pipeline, pipelineIndex) => {
    const buckets = formattedTimeBuckets[pipelineIndex];

    if (buckets) {
      for (const [bucketIndex, formattedBucket] of buckets.entries()) {
        const xAxisIndex = xAxis.findIndex((date) => date === formattedBucket);
        if (xAxisIndex !== -1) {
          if (yAxis[pipelineIndex]["data"][xAxisIndex]) {
            yAxis[pipelineIndex]["data"][xAxisIndex] +=
              pipeline.triggerCounts[bucketIndex];
          } else {
            yAxis[pipelineIndex]["data"][xAxisIndex] +=
              pipeline.triggerCounts[bucketIndex];
          }
        }
      }
    }
  });

  return { xAxis, yAxis };
}
