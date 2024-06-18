export function validateInstillResourceID(id: string) {
  return /^[a-z][-a-z0-9]{0,31}$/.test(id);
}
