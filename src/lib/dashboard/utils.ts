import { PipelineTrigger, PipelineTriggerCount, Status } from "@/types";
import { SingleSelectOption } from "@instill-ai/design-system";
import { Pipeline, ResourceState } from "@instill-ai/toolkit";

export function getPipeLineOptions(
  pipelines: Pipeline[]
): SingleSelectOption[] {
  const formattedPinelineOptions = pipelines?.map((pipeline) => {
    return {
      label: pipeline.id,
      value: pipeline.id,
    };
  });

  return [
    {
      label: "ALL",
      value: "all",
    },
    ...formattedPinelineOptions,
  ];
}

export function getStatusCount(
  triggers: PipelineTrigger[],
  triggersPrevious: PipelineTrigger[]
): Status[] {
  let STATE_ACTIVE = 0;
  let STATE_ACTIVE_PREVIOUS = 0;
  let STATE_INACTIVE = 0;
  let STATE_INACTIVE_PREVIOUS = 0;

  getPipelinesTriggerCount(triggers).forEach((trigger) => {
    STATE_ACTIVE += trigger.pipeline_completed;
    STATE_INACTIVE += trigger.pipeline_error;
  });

  getPipelinesTriggerCount(triggersPrevious).forEach((trigger) => {
    STATE_ACTIVE_PREVIOUS += trigger.pipeline_completed;
    STATE_INACTIVE_PREVIOUS += trigger.pipeline_error;
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

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
    date
  );
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const formattedDate = `${day} ${month}, ${year}`;
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return `${formattedDate} - ${formattedTime}`;
}

export function getPipelinesTriggerTime(
  pipelines: PipelineTriggerCount[]
): string[] {
  const triggerDates: string[] = [];

  pipelines.forEach((pipeline) => {
    pipeline.counts.forEach((count) => {
      triggerDates.push(count.trigger_time);
    });
  });

  // triggers.forEach((trigger) => {
  //   if (!triggerTime.includes(formatDateTime(trigger.trigger_time))) {
  //     triggerTime.push(formatDateTime(trigger.trigger_time));
  //   }
  // });

  const uniqueDates = Array.from(new Set(triggerDates)); // Convert Set to an array
  uniqueDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime()); // Sort dates in ascending order
  // const formattedDates = uniqueDates.map((date) => formatDateTime(date));
  // return formattedDates;

  return uniqueDates;
}

export function getPipelinesSeries(triggers: PipelineTriggerCount[]) {
  return triggers.map((trigger) => {
    return {
      name: trigger.pipeline_id,
      type: "line",
      smooth: true,
      data: trigger.counts.map((trigger) => trigger.count),
    };
  });
}

export function getStatus(status: string): ResourceState {
  if (status === "completed") {
    return "STATE_ACTIVE";
  }
  if (status === "errored") {
    return "STATE_ERROR";
  }
  return "STATE_UNSPECIFIED";
}

export function getColor(statusname: string) {
  switch (statusname) {
    case "STATE_ERROR":
    case "errored":
      return {
        textColor: "text-instillRed",
        bgColor: "bg-instillRed10",
        stateLabelName: "Error",
        icon: "instill_red",
      };

    case "STATE_ACTIVE":
    case "completed":
      return {
        textColor: "text-instillGreen50",
        bgColor: "bg-instillGreen10",
        stateLabelName: "Active",
        icon: "instillGreen50",
      };

    case "STATE_ONLINE":
      return {
        textColor: "text-instillGreen50",
        bgColor: "bg-instillGreen10",
        stateLabelName: "Online",
      };

    case "STATE_CONNECTED":
      return {
        textColor: "text-instillGreen50",
        bgColor: "bg-instillGreen10",
        stateLabelName: "Connected",
      };

    case "STATE_OFFLINE":
      return {
        textColor: "text-instillGrey70",
        bgColor: "bg-instillGrey05",
        stateLabelName: "Offline",
      };

    case "STATE_INACTIVE":
      return {
        textColor: "text-instillGrey70",
        bgColor: "bg-instillGrey05",
        stateLabelName: "Inactive",
      };

    case "STATE_DISCONNECTED":
      return {
        textColor: "text-instillGrey70",
        bgColor: "bg-instillGrey05",
        stateLabelName: "Disconnected",
      };

    default:
      return {
        textColor: "text-instillGrey70",
        bgColor: "bg-instillGrey05",
        stateLabelName: "Unspecified",
      };
  }
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

export function getPipelinesTriggerCount(
  triggers: PipelineTrigger[],
  pipelines: Pipeline[] = []
): PipelineTriggerCount[] {
  const countByTimeAndPipeline: PipelineTriggerCount[] = [];

  triggers.forEach((trigger) => {
    const triggerTime = formatDateTime(trigger.trigger_time);
    const pipelineId = trigger.pipeline_id;

    const existingPipeline = countByTimeAndPipeline.find(
      (entry) => entry.pipeline_id === pipelineId
    );

    if (existingPipeline) {
      const existingCount = existingPipeline.counts.find(
        (countEntry) => countEntry.trigger_time === triggerTime
      );
      if (existingCount) {
        existingCount.count += 1;
      } else {
        existingPipeline.counts.push({ trigger_time: triggerTime, count: 1 });
      }
      if (trigger.status === "errored") {
        existingPipeline.pipeline_error += 1;
      }
      if (trigger.status === "completed") {
        existingPipeline.pipeline_completed += 1;
      }
    } else {
      const pipelineObj: PipelineTriggerCount = {
        pipeline_id: pipelineId,
        pipeline_completed: trigger.status === "completed" ? 1 : 0,
        pipeline_error: trigger.status === "errored" ? 1 : 0,
        pipeline_uid: trigger.pipeline_uid,
        counts: [{ trigger_time: triggerTime, count: 1 }],
      };
      countByTimeAndPipeline.push(pipelineObj);
    }
  });

  // Add missing trigger times with count 0 for each pipeline
  const allTriggerTimes = triggers.map((trigger) =>
    formatDateTime(trigger.trigger_time)
  );
  const uniqueTriggerTimes = [...new Set(allTriggerTimes)];

  countByTimeAndPipeline.forEach((pipeline) => {
    uniqueTriggerTimes.forEach((triggerTime) => {
      const existingCount = pipeline.counts.find(
        (countEntry) => countEntry.trigger_time === triggerTime
      );
      if (!existingCount) {
        pipeline.counts.push({ trigger_time: triggerTime, count: 0 });
      }
    });
  });

  return countByTimeAndPipeline.map((pipelineTrigger) => {
    return {
      ...pipelineTrigger,
      status: pipelines.find(
        (pipeline) => pipeline.uid === pipelineTrigger.pipeline_uid
      )?.state,
    };
  });
}
