export function recursivelyRemoveUndefinedAndNullFromArray(array: any) {
  if (typeof array === "object") {
    for (const key in array) {
      array[key] = recursivelyRemoveUndefinedAndNullFromArray(
        array[key]
      ) as any;
    }
  }

  if (Array.isArray(array)) {
    array = array.filter((item) => item !== undefined);
  }

  return array;
}
