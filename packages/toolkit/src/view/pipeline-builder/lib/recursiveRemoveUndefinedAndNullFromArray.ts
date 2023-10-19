/* eslint-disable  @typescript-eslint/no-explicit-any */

export function recursiveRemoveUndefinedAndNullFromArray(array: any) {
  if (typeof array === "object") {
    for (const key in array) {
      array[key] = recursiveRemoveUndefinedAndNullFromArray(array[key]) as any;
    }
  }

  if (Array.isArray(array)) {
    array = array.filter((item) => item !== undefined);
  }

  return array;
}
