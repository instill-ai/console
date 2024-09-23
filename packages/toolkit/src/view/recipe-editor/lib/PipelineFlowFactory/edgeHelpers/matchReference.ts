/**
 * Helper function to check if a reference is available
 */
export function matchReference(
  definedReference: string,
  availableReference: string,
): boolean {
  const referenceValueWithoutArray = definedReference.replaceAll(
    /\[[^\]]+\]/g,
    "",
  );

  // Once a value includes [], we will loosely check the reference.
  // For example, we will connect st_1.output["Foo"], even st_1 don't have
  // Foo field
  if (definedReference.includes("[") || definedReference.includes("]")) {
    const valueComponentID = referenceValueWithoutArray.split(".")[0];
    const avaiableReferenceComponentID = availableReference.split(".")[0];
    if (valueComponentID === avaiableReferenceComponentID) {
      return true;
    }

    return false;
  }

  if (availableReference === referenceValueWithoutArray) {
    return true;
  }

  // If the target is a object, user can reference the key in the object, which may
  // break how we check if the reference is available. For example, if the target is
  // "comp_1.output.my_object", and the user reference "comp_1.output.my_object.key1",
  // we should still allow it.

  // This should also allow comp_1.output

  const firstThreeLayersOfReferenceValueWithoutArray =
    referenceValueWithoutArray.split(".").slice(0, 2).join(".");

  if (
    firstThreeLayersOfReferenceValueWithoutArray.includes(availableReference)
  ) {
    return true;
  }

  return false;
}
