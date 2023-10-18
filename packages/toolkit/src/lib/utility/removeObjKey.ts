export function removeObjKey(obj: Record<string, any>, key: string) {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => k !== key));
}
