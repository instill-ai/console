export function validateResourceId(resourceId: string) {
  return /^[a-z]([a-z0-9-]{0,61}[a-z0-9])?$/.test(resourceId);
}
