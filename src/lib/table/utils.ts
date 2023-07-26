import { PipelineTriggerStatus, ResourceState } from "@instill-ai/toolkit";

export function formatDate(inputDate: string): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = date.getDate();

  // Format the date as "Month Day, Year"
  const formattedDate = `${month} ${day}, ${year}`;

  return formattedDate;
}

export function parseStatusLabel(
  status: PipelineTriggerStatus | ResourceState
): string {
  const convertedStatus = status
    .split("_")
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )[1];

  return convertedStatus;
}
