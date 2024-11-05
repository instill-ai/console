export function getDateRange(range: string): string[] {
  const today = new Date();
  const dates: string[] = [];

  if (range === "1d" || range === "24h") {
    const startDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0,
    );
    const endDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
    );

    for (
      let date = startDate;
      date < endDate;
      date.setHours(date.getHours() + 1)
    ) {
      dates.push(date.toISOString().split(".")[0] + "Z");
    }
    // push end date
    dates.push(endDate.toISOString().split(".")[0] + "Z");
  } else if (range.endsWith("d")) {
    const days = parseInt(range.slice(0, -1));
    const startDate = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);

    for (
      let date = startDate;
      date <= today;
      date.setDate(date.getDate() + 1)
    ) {
      dates.push(date.toISOString().split(".")[0] + "Z");
    }
  } else {
    throw new Error(
      "Invalid range format. Please use the format <number>d, 24h, or 1d.",
    );
  }

  return dates;
}
