/* eslint-disable  @typescript-eslint/no-explicit-any */

export function recursiveParseToNum(input: any): any {
  if (typeof input === "number") {
    // If input is already a number, return it.
    return input;
  } else if (typeof input === "string") {
    // Use unart plus to parse strings to numbers.
    if (!isNaN(+input)) {
      if (input !== "") {
        return +input;
      } else {
        return input;
      }
    }
  } else if (Array.isArray(input)) {
    // If it's an array, recursively parse its elements.
    const parsedArray = input.map((element) => recursiveParseToNum(element));
    return parsedArray as any;
  } else if (typeof input === "object" && input !== null) {
    // If it's an object, recursively parse its properties.
    const parsedObject: { [key: string]: any } = {};
    for (const key in input) {
      parsedObject[key] = recursiveParseToNum(input[key]);
    }
    return parsedObject;
  }

  // Return null for unsupported types or values that can't be converted to int.
  return input;
}
