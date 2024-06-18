// This is specific for variable and output field keys

export function validateInstillVariableAndOutputKey(id: string) {
  return /^[a-z_][-a-z_0-9]{0,31}$/.test(id);
}
