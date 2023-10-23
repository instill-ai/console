import { dot } from "../../dot";
import { GeneralRecord, Nullable } from "../../type";
import { InstillFormTree } from "../type";

export function transformInstillFormTreeToDefaultValue({
  tree,
  data,
  isRoot,
}: {
  tree: InstillFormTree;
  data: GeneralRecord;

  // This is only used for formArray
  isRoot?: boolean;
}) {
  // We don't need to set the field key for formCondition because in the
  // conditions are formGroup, we will set the fieldKey there

  if (tree._type === "formCondition") {
    const constField = tree.conditions[
      Object.keys(tree.conditions)[0]
    ].properties.find((e) => "const" in e);

    if (constField && constField.path && "const" in constField) {
      transformInstillFormTreeToDefaultValue({
        tree: tree.conditions[Object.keys(tree.conditions)[0]],
        data,
      });

      dot.setter(data, constField.path, constField.const as string);
    }

    return;
  }

  if (tree._type === "formGroup") {
    const formGroupValue: Record<string, any> = {};

    for (const property of tree.properties) {
      transformInstillFormTreeToDefaultValue({
        tree: property,
        data: formGroupValue,
      });
    }

    for (const [key, value] of Object.entries(formGroupValue)) {
      dot.setter(data, key, value);
    }

    return;
  }

  if (tree._type === "formArray") {
    const formArrayValue: Record<string, any> = {};

    for (const property of tree.properties) {
      transformInstillFormTreeToDefaultValue({
        tree: property,
        data: formArrayValue,
        isRoot: true,
      });
    }

    if (tree.path) {
      dot.setter(data, tree.path, [formArrayValue]);
    }
    return;
  }

  let defaultValue: Nullable<string> = null;

  const key = isRoot ? tree.fieldKey : tree.path;

  if (!key) {
    return;
  }

  if (tree.type === "boolean") {
    dot.setter(data, key, false);
    return;
  }

  if ("examples" in tree) {
    switch (typeof tree.examples) {
      case "object":
        if (Array.isArray(tree.examples)) {
          defaultValue = `${tree.examples[0]}`;
        }
        break;
      case "number":
        defaultValue = `${tree.examples}`;
        break;
      case "string":
        defaultValue = tree.examples;
        break;
      default:
        defaultValue = null;
    }

    dot.setter(data, key, defaultValue);
    return;
  }

  if ("example" in tree) {
    switch (typeof tree.example) {
      case "number":
        defaultValue = `${tree.example}`;
        break;
      case "string":
        defaultValue = `${tree.example}`;
        break;
      default:
        defaultValue = null;
    }

    dot.setter(data, key, defaultValue);
    return;
  }

  dot.setter(data, key, defaultValue);
  return;
}
