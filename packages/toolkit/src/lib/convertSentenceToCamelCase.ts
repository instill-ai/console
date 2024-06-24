//https://stackoverflow.com/a/71426723/2205002
export const convertSentenceToCamelCase = (str: string) =>
  str
    .split(" ")
    .map((e, i) =>
      i
        ? e.charAt(0).toUpperCase() + e.slice(1).toLowerCase()
        : e.toLowerCase(),
    )
    .join("");
