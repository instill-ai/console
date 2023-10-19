export type TriggerDate = {
  date: Date;
  dateString: string;
};

export function sortByDate(dateArray: string[]) {
  const parsedArray: TriggerDate[] = dateArray.map((dateString) => ({
    date: new Date(dateString),
    dateString: dateString,
  }));

  return parsedArray
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((date) => date.dateString);
}
