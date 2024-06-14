const formatter = Intl.NumberFormat("en-US");

export function formatNumberToLocale(numberToFormat: number) {
  return formatter.format(numberToFormat);
}
