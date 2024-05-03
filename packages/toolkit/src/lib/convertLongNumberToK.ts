const shortener = Intl.NumberFormat('en-US', {
  notation: "compact",
  maximumFractionDigits: 1
});

export function convertLongNumberToK (numberToConvert: number) {
  return shortener.format(numberToConvert);
}