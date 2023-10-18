export type DashboardAvailableTimeframe =
  | "24h"
  | "1d"
  | "2d"
  | "3d"
  | "4d"
  | "6d"
  | "7d"
  | "8d"
  | "14d"
  | "30d";

export function getPreviousTimeframe(
  timeframe: DashboardAvailableTimeframe
): string {
  if (timeframe === "24h" || timeframe === "1d") {
    return "2d";
  }
  if (timeframe === "2d") {
    return "4d";
  }
  if (timeframe === "3d") {
    return "6d";
  }
  if (timeframe === "4d") {
    return "8d";
  }
  if (timeframe === "7d") {
    return "14d";
  }
  if (timeframe === "30d") {
    return "60d";
  }

  throw new Error("Invalid timeframe.");
}
