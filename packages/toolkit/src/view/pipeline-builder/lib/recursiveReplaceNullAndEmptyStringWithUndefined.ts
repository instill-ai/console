/* eslint-disable  @typescript-eslint/no-explicit-any */

type RecursiveReplaceNullAndEmptyStringWithUndefined<T> = T extends null
  ? undefined
  : T extends (infer U)[]
  ? RecursiveReplaceNullAndEmptyStringWithUndefined<U>[]
  : T extends Record<string, unknown>
  ? { [K in keyof T]: RecursiveReplaceNullAndEmptyStringWithUndefined<T[K]> }
  : T;

export function recursiveReplaceNullAndEmptyStringWithUndefined<T>(
  obj: T
): RecursiveReplaceNullAndEmptyStringWithUndefined<T> {
  if ((obj as any) === "") {
    return undefined as any;
  }

  if (obj === null || obj === undefined) {
    return undefined as any;
  }

  if ((obj as any).constructor.name === "Object" || Array.isArray(obj)) {
    for (const key in obj) {
      obj[key] = recursiveReplaceNullAndEmptyStringWithUndefined(
        obj[key]
      ) as any;
    }
  }
  return obj as any;
}
