export function convertTimestampToLocal(dateString: string): string {
  const inputDate = new Date(dateString);
  const currentDate = new Date();

  // Check if the input date is today
  if (
    inputDate.getDate() === currentDate.getDate() &&
    inputDate.getMonth() === currentDate.getMonth() &&
    inputDate.getFullYear() === currentDate.getFullYear()
  ) {
    return `Today, ${inputDate.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    })}`;
  }

  // Format for January 14, 10:00:15 AM
  if (inputDate.getFullYear() === currentDate.getFullYear()) {
    return inputDate.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });
  }

  // Format for December 29, 2022, 11:30:45 AM
  return inputDate.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
}
