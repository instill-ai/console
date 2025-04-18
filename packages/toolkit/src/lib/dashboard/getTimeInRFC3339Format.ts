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

  if (interval === "todayStart") {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to 12:00 AM
    return today.toISOString().split(".")[0] + "Z";
  }

  if (interval === "todayEnd") {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set time to 11:59 PM
    return today.toISOString().split(".")[0] + "Z";
  }

  if (!match || !match[1]) {
    throw new Error(
      "Invalid time interval format. Supported formats are: now, todayStart, 1h, 3h, 6h, 24h, 1d, 7d",
    );
  }

  const value = parseInt(match[1]);
  const unit = match[2];

  if (!value || value <= 0) {
    throw new Error("Invalid time value. Value must be a positive integer.");
  }

  if (!unit) {
    throw new Error(
      "Invalid time unit. Supported units are: h (hour), d (day)",
    );
  }

  if (!Object.prototype.hasOwnProperty.call(timeUnits, unit)) {
    throw new Error(
      "Invalid time unit. Supported units are: h (hour), d (day)",
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
