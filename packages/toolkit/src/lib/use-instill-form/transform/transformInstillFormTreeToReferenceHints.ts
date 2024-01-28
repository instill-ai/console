import { ComponentOutoutReferenceHint, InstillFormTree } from "../type";

export function transformInstillFormTreeToReferenceHints(
  tree: InstillFormTree,
  isObjectArrayChild?: boolean,
  objectArrayParentPath?: string
): ComponentOutoutReferenceHint[] {
  // 1. Preprocess
  const title = tree.title ?? tree.fieldKey;
  const referenceHints: ComponentOutoutReferenceHint[] = [];

  // Normall a objectArray child will be a formGroup with the same
  // path, so we only need to pass the isObjectArrayChild flag and
  // objectArrayParentPath to the children

  // 2. Process

  if (tree._type === "formGroup") {
    for (const property of tree.properties) {
      const hints = transformInstillFormTreeToReferenceHints(
        property,
        isObjectArrayChild,
        objectArrayParentPath
      );
      referenceHints = [...referenceHints, ...hints];
    }
    return referenceHints;
  }

  // The component output don't have formCondition
  if (tree._type === "formCondition") {
    return referenceHints;
  }

  if (tree._type === "objectArray") {
    // ObjectArray need to have the path (by instill protocol the top level won't be the
    // objectArray, so we can safely assume that the path is not null)
    if (tree.path) {
      const hints = transformInstillFormTreeToReferenceHints(
        tree.properties,
        true,
        tree.path
      );
      referenceHints = [...referenceHints, ...hints];
    }
    return referenceHints;
  }

  // Process const field
  if (tree.const || !tree.path) {
    return referenceHints;
  }

  // We don't need to hint a field that is lacking instillFormat
  if (!tree.instillFormat) {
    return referenceHints;
  }

  // We don't need to hint a field that is lacking title and key
  if (!title) {
    return referenceHints;
  }

  // Process a normal field

  const hint: ComponentOutoutReferenceHint =
    isObjectArrayChild && objectArrayParentPath
      ? {
          title,
          path: tree.path,
          instillFormat: tree.instillFormat,
          isObjectArrayChild: isObjectArrayChild ?? false,
          objectArrayParentPath,
        }
      : {
          title,
          path: tree.path,
          instillFormat: tree.instillFormat,
          isObjectArrayChild: false,
        };

  return [...referenceHints, hint];
}
