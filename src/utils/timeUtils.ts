/**
 * Compare two given time and return comparison
 */
export const getHumanReadableStringFromTime = (
  prevTime: string,
  nextTime: string | number
) => {
  const prev = Date.parse(prevTime) / 1000;

  let next: number;

  if (typeof nextTime === "number") {
    next = nextTime;
  } else {
    next = Date.parse(nextTime) / 1000;
  }

  if (prev > next) {
    throw new Error(
      `prevTime - ${prevTime} is ahead of nextTime - ${nextTime}`
    );
  }

  const seconds = next - prev;

  if (seconds === 1) {
    return "a second ago";
  }

  if (seconds < 60) {
    return `${seconds} seconds ago`;
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes >= 1 && minutes < 2) {
    return "a minute ago";
  }

  if (minutes < 60) {
    return `${minutes} minutes ago`;
  }

  const hours = Math.floor(seconds / 3600);

  if (hours >= 1 && hours < 2) {
    return "an hour ago";
  }

  if (hours < 24) {
    return `${hours} hours ago`;
  }

  const days = Math.floor(seconds / 86400);

  if (days >= 1 && days < 2) {
    return "yesterday";
  }

  if (days < 30) {
    return `${days} days ago`;
  }

  const months = Math.floor(seconds / 2592000);

  if (months >= 1 && months < 2) {
    return "last month";
  }

  if (months < 12) {
    return `${months} months ago`;
  }

  return new Date(prevTime).toDateString();
};
