import { AirbyteFormTree } from "./types";

const getFieldPaths = (
  formTree: AirbyteFormTree | AirbyteFormTree[],
  forceUnique: boolean
): string[] => {
  const fieldPaths = [];

  if (Array.isArray(formTree)) {
    for (const branch of formTree) {
      const paths = pickPath(branch);
      fieldPaths.push(...paths);
    }
  } else {
    const paths = pickPath(formTree);
    fieldPaths.push(...paths);
  }

  if (forceUnique) {
    return Array.from(new Set(fieldPaths));
  } else {
    return fieldPaths;
  }
};

const pickPath = (
  formTree: AirbyteFormTree,
  paths: string[] = []
): string[] => {
  if (formTree._type === "formGroup") {
    const newPaths: string[] = [];
    formTree.properties.map((e) => {
      const childPaths = pickPath(e, paths);
      newPaths.push(...childPaths);
    });
    newPaths.push(...paths);
    return newPaths;
  }

  if (formTree._type === "formCondition") {
    const newPaths: string[] = [];
    Object.entries(formTree.conditions).forEach(([, v]) => {
      console.log(v);
      const childPaths = pickPath(v, paths);
      newPaths.push(...childPaths);
    });
    newPaths.push(...paths);
    return newPaths;
  }

  if (formTree._type === "objectArray") {
    let newPaths: string[] = [];
    const childPaths = pickPath(formTree.properties, paths);
    newPaths = [...childPaths, ...paths];
    return newPaths;
  }

  const newPaths = [formTree.path, ...paths];
  return newPaths;
};

export default getFieldPaths;
