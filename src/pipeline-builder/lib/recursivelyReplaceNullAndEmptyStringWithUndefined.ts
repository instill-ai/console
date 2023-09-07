/* eslint-disable  @typescript-eslint/no-explicit-any */

type RecursivelyReplaceNullAndEmptyStringWithUndefined<T> = T extends null
  ? undefined
  : T extends (infer U)[]
  ? RecursivelyReplaceNullAndEmptyStringWithUndefined<U>[]
  : T extends Record<string, unknown>
  ? { [K in keyof T]: RecursivelyReplaceNullAndEmptyStringWithUndefined<T[K]> }
  : T;

export function recursivelyReplaceNullAndEmptyStringWithUndefined<T>(
  obj: T
): RecursivelyReplaceNullAndEmptyStringWithUndefined<T> {
  if ((obj as any) === "") {
    return undefined as any;
  }

  if (obj === null || obj === undefined) {
    return undefined as any;
  }

  if ((obj as any).constructor.name === "Object" || Array.isArray(obj)) {
    for (const key in obj) {
      obj[key] = recursivelyReplaceNullAndEmptyStringWithUndefined(
        obj[key]
      ) as any;
    }
  }
  return obj as any;
}
