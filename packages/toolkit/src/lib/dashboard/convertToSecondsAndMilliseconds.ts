export function convertToSecondsAndMilliseconds(decimalValue: number): string {
  const seconds = Math.floor(decimalValue); // Extract the whole number part (seconds)
  const milliseconds = Math.round((decimalValue - seconds) * 1000); // Extract the fractional part and convert to milliseconds

  return `${seconds} sec ${milliseconds} ms`;
}
