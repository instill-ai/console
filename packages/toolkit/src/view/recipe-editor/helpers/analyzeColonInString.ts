export function analyzeColonInString(str: string, position: number) {
  const colonMatches = str.match(/:/g);

  if (!colonMatches) {
    throw new Error("No colon found in the string");
  }

  if (colonMatches.length > 1) {
    throw new Error("Multiple colons found in the string");
  }

  const colonIndex = str.indexOf(":");
  const isBeforeColon = position < colonIndex;

  const substringBeforeColon = str.substring(0, colonIndex).replaceAll(" ", "");

  return {
    isBeforeColon,
    substringBeforeColon,
  };
}
