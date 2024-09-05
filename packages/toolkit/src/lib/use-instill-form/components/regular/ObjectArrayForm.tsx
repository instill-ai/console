import * as React from "react";
import { useFieldArray } from "react-hook-form";

import { dot } from "../../../dot";
import { GeneralUseFormReturn } from "../../../type";
import {
  pickRegularFieldsFromInstillFormTree,
  PickRegularFieldsFromInstillFormTreeOptions,
} from "../../pick";
import { transformInstillFormTreeToDefaultValue } from "../../transform";
import { InstillObjectArrayItem, SelectedConditionMap } from "../../types";

export const ObjectArrayForm = ({
  path,
  form,
  tree,
  selectedConditionMap,
  setSelectedConditionMap,
  parentPath,
  options,
}: {
  path: string;
  form: GeneralUseFormReturn;
  tree: InstillObjectArrayItem;
  selectedConditionMap: SelectedConditionMap | null;
  setSelectedConditionMap: React.Dispatch<
    React.SetStateAction<SelectedConditionMap | null>
  >;
  parentPath: string;
  options?: PickRegularFieldsFromInstillFormTreeOptions;
}) => {
  const { fields, append, remove } = useFieldArray({
    name: path,
    control: form.control,
  });

  return (
    <div className="flex flex-col p-4 gap-y-1 border border-semantic-bg-line rounded">
      {fields.map((field, index) => (
        <div className="flex flex-col" key={field.id}>
          {pickRegularFieldsFromInstillFormTree(
            tree.properties,
            form,
            selectedConditionMap,
            setSelectedConditionMap,
            {
              ...options,
              objectArrayIndex: index,
              parentIsObjectArray: true,
              parentPath: parentPath,
            },
          )}
          {fields.length === 1 ? null : (
            <button type="button" onClick={() => remove(index)}>
              remove
            </button>
          )}
        </div>
      ))}
      <div className="flex flex-row">
        <button
          className="text-semantic-fg-disabled product-body-text-3-medium"
          type="button"
          onClick={() => {
            if (!tree.path) {
              return;
            }
            const defaultValue = transformInstillFormTreeToDefaultValue(
              tree.properties,
            );

            const valueWOParentDotPath = dot.getter(defaultValue, tree.path);
            console.log(tree, path, defaultValue, valueWOParentDotPath);
            append(valueWOParentDotPath);
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
};
