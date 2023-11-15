export function validateComponentID(componentID: string) {
  return /^[a-zA-Z_]{0,62}[a-zA-Z_0-9]*$/.test(componentID);
}
