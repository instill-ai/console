import { GeneralRecord } from "../type";

export function removeObjKey(obj: GeneralRecord, key: string) {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => k !== key));
}
