export function formatDate(inputDate: string): string {
  return new Date(inputDate).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
