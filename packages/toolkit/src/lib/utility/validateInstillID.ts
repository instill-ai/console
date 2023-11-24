export function validateInstillID(id: string) {
  return /^[a-z_][-a-z_0-9]{0,31}$/.test(id);
}
