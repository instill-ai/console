export type GenerateDateInPastOptions = {
  hours?: number;
  days?: number;
  months?: number;
  years?: number;
};

export const generateDateInPast = (
  startDate: string | number,
  { hours, days, months, years }: GenerateDateInPastOptions
) => {
  const date = new Date(startDate);

  if (years) {
    date.setFullYear(date.getFullYear() - years);
  }

  if (months) {
    date.setMonth(date.getMonth() - months);
  }

  if (days) {
    date.setDate(date.getDate() - days);
  }

  if (hours) {
    date.setHours(date.getHours() - hours);
  }

  return date;
};
