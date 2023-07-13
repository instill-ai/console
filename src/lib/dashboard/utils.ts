import {
  Count,
  PipelineTrigger,
  PipelineTriggerCount,
  StatusCount,
  TriggerCount,
} from "@/types";
import { SingleSelectOption } from "@instill-ai/design-system";
import { Pipeline } from "@instill-ai/toolkit";
import { defaultTimeOption } from "./options";

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
): StatusCount {
  let pipelineCompleteAmount = 0;
  let pipelineCompleteAmountPrevious = 0;
  let pipelineErroredAmount = 0;
  let pipelineErroredAmountPrevious = 0;

  getPipelinesTriggerCount(triggers).forEach((trigger) => {
    pipelineCompleteAmount += trigger.pipeline_completed;
    pipelineErroredAmount += trigger.pipeline_error;
  });

  getPipelinesTriggerCount(triggersPrevious).forEach((trigger) => {
    pipelineCompleteAmountPrevious += trigger.pipeline_completed;
    pipelineErroredAmountPrevious += trigger.pipeline_error;
  });

  return {
    completed: {
      state: "completed",
      amount: pipelineCompleteAmount,
      type: "pipeline",
      change: calculatePercentageChange(
        pipelineCompleteAmountPrevious,
        pipelineCompleteAmount
      ),
    },
    errored: {
      state: "errored",
      amount: pipelineErroredAmount,
      type: "pipeline",
      change: calculatePercentageChange(
        pipelineErroredAmountPrevious,
        pipelineErroredAmount
      ),
    },
  };
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

export function formatDateTime(timeStr: string, format: string): string {
  const dt = new Date(timeStr);
  const month = new Intl.DateTimeFormat("en", { month: "short" }).format(dt);
  const day = dt.getDate();

  if (format === "1d" || format === "24h") {
    const hours = dt.getHours();
    const minutes = dt.getMinutes();
    const period = format === "1d" ? (hours >= 12 ? "PM" : "AM") : "";
    const formattedHours = format === "1d" ? hours % 12 || 12 : hours;

    return `${month} ${day}, ${formattedHours}:${String(minutes).padStart(
      2,
      "0"
    )} ${period}`;
  }
  return `${month} ${day}`;
}

export function getPipelinesSeries(triggers: TriggerCount[]) {
  return triggers.map((trigger) => {
    return {
      name: trigger.pipeline_id,
      type: "line",
      smooth: true,
      data: orderEventsByTriggerTime(trigger.counts).map(
        (trigger) => trigger.count
      ),
    };
  });
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
  pipelines: Pipeline[] = [],
  selectedTimeOption: SingleSelectOption = defaultTimeOption
): PipelineTriggerCount[] {
  const countByTimeAndPipeline: PipelineTriggerCount[] = [];

  triggers.forEach((trigger) => {
    const triggerTime = formatDateTime(
      trigger.trigger_time,
      selectedTimeOption.value
    );

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
  const allTriggerTimes = getDateRange(selectedTimeOption.value);

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

export function getDateRange(range: string): string[] {
  const today = new Date();
  const dates: string[] = [];

  if (range === "1d") {
    const startDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 1,
      0,
      0,
      0
    );
    const endDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0
    );

    for (
      let date = startDate;
      date < endDate;
      date.setHours(date.getHours() + 1)
    ) {
      dates.push(
        date.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        })
      );
    }
  } else if (range === "24h") {
    const startDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0
    );

    for (
      let date = startDate;
      date <= today;
      date.setHours(date.getHours() + 1)
    ) {
      dates.push(
        date.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        })
      );
    }
  } else if (range.endsWith("d")) {
    const days = parseInt(range.slice(0, -1));
    const startDate = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);

    for (
      let date = startDate;
      date <= today;
      date.setDate(date.getDate() + 1)
    ) {
      dates.push(
        date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      );
    }
  } else {
    throw new Error(
      "Invalid range format. Please use the format <number>d, 24h, or 1d."
    );
  }

  return dates;
}

export function orderEventsByTriggerTime(events: Count[]): Count[] {
  const formattedEvents: Count[] = events.map((event) => {
    const triggerTime = new Date(event.trigger_time);
    return { ...event, trigger_time: triggerTime };
  });

  const sortedEvents = formattedEvents.sort(
    (a, b) =>
      new Date(a.trigger_time).getTime() - new Date(b.trigger_time).getTime()
  );

  return sortedEvents;
}
