export function formatDateTime(timeStr: string, format: string): string {
  const dt = new Date(timeStr);
  const month = new Intl.DateTimeFormat("en", { month: "short" }).format(dt);
  const day = dt.getDate();

  if (format === "1d" || format === "24h") {
    const hours = dt.getHours();
    const minutes = dt.getMinutes();
    const period =
      format === "1d" || format === "24h" ? (hours >= 12 ? "PM" : "AM") : "";
    const formattedHours =
      format === "1d" || format === "24h" ? hours % 12 || 12 : hours;

    return `${month} ${day}, ${formattedHours}:${String(minutes).padStart(
      2,
      "0"
    )} ${period}`;
  }
  return `${month} ${day}`;
}
