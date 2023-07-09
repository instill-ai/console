import { PipelineTrigger, PipelineTriggerCount, Status } from "@/types";
import { SingleSelectOption } from "@instill-ai/design-system";
import { ResourceState } from "@instill-ai/toolkit";

export function getPipelinesTriggerCount(
  pipelines: PipelineTrigger[]
): PipelineTriggerCount[] {
  const pipelinesTriggerCount: PipelineTriggerCount[] = [];

  pipelines.forEach((pipeline) => {
    const triggerCountIndex = pipelinesTriggerCount.findIndex(
      (pipelineTriggerCount) =>
        pipelineTriggerCount.pipeline_uid === pipeline.pipeline_uid
    );

    if (triggerCountIndex !== -1) {
      if (pipeline.status === "errored") {
        pipelinesTriggerCount[triggerCountIndex].pipeline_error += 1;
      }
      if (pipeline.status === "completed") {
        pipelinesTriggerCount[triggerCountIndex].pipeline_completed += 1;
      }
      pipelinesTriggerCount[triggerCountIndex].compute_time_duration.push(
        pipeline.compute_time_duration
      );
    } else {
      pipelinesTriggerCount.push({
        pipeline_id: pipeline.pipeline_id,
        pipeline_uid: pipeline.pipeline_uid,
        pipeline_completed: pipeline.status === "completed" ? 1 : 0,
        pipeline_error: pipeline.status === "error" ? 1 : 0,
        compute_time_duration: [pipeline.compute_time_duration],
      });
    }
  });

  return pipelinesTriggerCount;
}

export function getPipeLineOptions(
  pipelines: PipelineTrigger[]
): SingleSelectOption[] {
  const formattedPinelineOptions = getPipelinesTriggerCount(pipelines).map(
    (pipeline) => {
      return {
        label: pipeline.pipeline_id,
        value: pipeline.pipeline_id,
      };
    }
  );
  return [
    {
      label: "ALL",
      value: "all",
    },
    ...formattedPinelineOptions,
  ];
}

export function getStatusCount(
  pipelines: PipelineTrigger[],
  pipelinesPrevious: PipelineTrigger[]
): Status[] {
  let STATE_ACTIVE = 0;
  let STATE_ACTIVE_PREVIOUS = 0;
  let STATE_INACTIVE = 0;
  let STATE_INACTIVE_PREVIOUS = 0;

  getPipelinesTriggerCount(pipelines).forEach((pipeline) => {
    STATE_ACTIVE += pipeline.pipeline_completed;
    STATE_INACTIVE += pipeline.pipeline_error;
  });

  getPipelinesTriggerCount(pipelinesPrevious).forEach((pipeline) => {
    STATE_ACTIVE_PREVIOUS += pipeline.pipeline_completed;
    STATE_INACTIVE_PREVIOUS += pipeline.pipeline_error;
  });

  return [
    {
      statusname: "completed",
      amount: STATE_ACTIVE,
      type: "pipeline",
      change: calculatePercentageChange(STATE_ACTIVE_PREVIOUS, STATE_ACTIVE),
    },
    {
      statusname: "errored",
      amount: STATE_INACTIVE,
      type: "pipeline",
      change: calculatePercentageChange(
        STATE_INACTIVE_PREVIOUS,
        STATE_INACTIVE
      ),
    },
  ];
}

export function getTimeInRFC3339Format(interval: string): string {
  const timeUnits: { [key: string]: string } = {
    h: "hour",
    d: "day",
  };

  const regex = /^(\d+)([hd])$/;
  const match = interval.match(regex);

  if (interval === "now") {
    return new Date().toISOString().split(".")[0] + "Z";
  }

  if (!match) {
    throw new Error(
      "Invalid time interval format. Supported formats are: now, 1h, 3h, 6h, 24h, 1d, 7d"
    );
  }

  const value = parseInt(match[1]);
  const unit = match[2];

  if (!value || value <= 0) {
    throw new Error("Invalid time value. Value must be a positive integer.");
  }

  if (!Object.prototype.hasOwnProperty.call(timeUnits, unit)) {
    throw new Error(
      "Invalid time unit. Supported units are: h (hour), d (day)"
    );
  }

  const currentTime = new Date();
  const targetTime = new Date(currentTime.getTime());

  if (unit === "h") {
    targetTime.setHours(currentTime.getHours() - value);
  } else {
    targetTime.setDate(currentTime.getDate() - value);
  }

  return targetTime.toISOString().split(".")[0] + "Z";
}

export function formatDateTime(dateTimeString: string): string {
  const dateTime = new Date(dateTimeString);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    fractionalSecondDigits: dateTime.getMilliseconds() > 0 ? 3 : undefined,
  };
  return dateTime.toLocaleDateString("en-US", options);
}

export function getPipelinesTriggerTime(pipelines: PipelineTrigger[]) {
  const triggerTime: string[] = [];

  pipelines.forEach((pipeline) => {
    if (!triggerTime.includes(formatDateTime(pipeline.trigger_time))) {
      triggerTime.push(formatDateTime(pipeline.trigger_time));
    }
  });

  return triggerTime;
}

export function getPipelinesSeries(pipelines: PipelineTriggerCount[]) {
  return pipelines.map((pipeline) => {
    return {
      name: pipeline.pipeline_id,
      type: "line",
      smooth: true,
      data: pipeline.compute_time_duration,
    };
  });
}

export function getStatus(status: string): ResourceState {
  if (status === "completed") {
    return "STATE_ACTIVE";
  }
  if (status === "error") {
    return "STATE_ERROR";
  }
  return "STATE_UNSPECIFIED";
}

export function calculatePercentageChange(
  previousCount: number,
  currentCount: number
): number {
  if (previousCount === 0 && currentCount === 0) {
    return 0; // Both counts are zero, return 0 as percentage change
  }

  if (previousCount === 0) {
    return currentCount; // Previous count is zero, change is currentCount
  }

  const change = currentCount - previousCount;
  const percentageChange = (change / previousCount) * 100;
  return Math.round(percentageChange);
}

export function getPreviousTime(time: string): string {
  if (time === "24h" || time === "1d") {
    return "2d";
  }
  if (time === "2d") {
    return "4d";
  }
  if (time === "3d") {
    return "6d";
  }
  if (time === "4d") {
    return "8d";
  }
  if (time === "7d") {
    return "14d";
  }
  if (time === "30d") {
    return "60d";
  }
  return "";
}
