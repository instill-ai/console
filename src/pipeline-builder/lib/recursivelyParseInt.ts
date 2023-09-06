/* eslint-disable  @typescript-eslint/no-explicit-any */

export function recursivelyParseInt(obj: any) {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if ((obj as any).constructor.name === "Object" || Array.isArray(obj)) {
    for (const key in obj) {
      obj[key] = recursivelyParseInt(obj[key]) as any;
    }
  }

  if (!isNaN(Number(obj))) {
    return Number(obj);
  } else {
    return obj;
  }
}
