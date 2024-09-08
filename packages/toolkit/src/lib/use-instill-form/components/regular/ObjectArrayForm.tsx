import * as React from "react";
import { GeneralRecord } from "instill-sdk";
import { useFieldArray } from "react-hook-form";

import { dot } from "../../../dot";
import { GeneralUseFormReturn } from "../../../type";
import {
  pickRegularFieldsFromInstillFormTree,
  PickRegularFieldsFromInstillFormTreeOptions,
} from "../../pick";
import {
  transformInstillFormTreeToDefaultValue,
  transformInstillFormTreeToInitialSelectedCondition,
} from "../../transform";
import { InstillObjectArrayItem, SelectedConditionMap } from "../../types";

export const ObjectArrayForm = ({
  path,
  form,
  tree,
  selectedConditionMap,
  setSelectedConditionMap,
  options,
}: {
  path: string;
  form: GeneralUseFormReturn;
  tree: InstillObjectArrayItem;
  selectedConditionMap: SelectedConditionMap | null;
  setSelectedConditionMap: React.Dispatch<
    React.SetStateAction<SelectedConditionMap | null>
  >;
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
              parentPath: path,
            },
          )}
          {fields.length === 1 ? null : (
            <button
              type="button"
              onClick={() => {
                // This is a modified version of the code from @orangecoloured
                // Take this selectedConditionMap for example:
                // {
                //   "path.0.title": "test",
                //   "path.1.title": "test1",
                //   "path.2.title": "test2",
                // }
                // When we remove the item with index 1, we want to update the selectedConditionMap
                // so that it looks like this:
                // {
                //   "path.0.title": "test",
                //   "path.1.title": "test2",
                // }

                const propsToUpdate: string[] = [];
                const propsToCopy: string[] = [];

                Object.keys(selectedConditionMap ?? {}).forEach((item) => {
                  if (item.startsWith(path)) {
                    const currentIndex = parseInt(
                      item.replace(`${path}.`, "").split(".")[0] || "",
                      10,
                    );

                    if (currentIndex > index) {
                      propsToUpdate.push(item);
                    } else if (currentIndex < index) {
                      propsToCopy.push(item);
                    }
                  } else {
                    propsToCopy.push(item);
                  }
                });

                const newSelectedConditionMap: GeneralRecord = {};

                propsToCopy.forEach((item) => {
                  if (selectedConditionMap) {
                    newSelectedConditionMap[item] = selectedConditionMap[item];
                  }
                });

                propsToUpdate.forEach((item) => {
                  if (selectedConditionMap) {
                    const number = parseInt(
                      item.replace(`${path}.`, "").split(".")[0] || "",
                      10,
                    );
                    const suffix = item.replace(`${path}.${number}.`, "");

                    newSelectedConditionMap[`${path}.${number - 1}.${suffix}`] =
                      selectedConditionMap[`${path}.${number}.${suffix}`];
                  }
                });

                setSelectedConditionMap(newSelectedConditionMap);

                remove(index);
              }}
            >
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

            const childSelectedConditionMap =
              transformInstillFormTreeToInitialSelectedCondition(
                tree.properties,
                {
                  parentIsObjectArray: true,
                  parentPath: path,
                  objectArrayIndex: fields.length,
                },
              );

            setSelectedConditionMap({
              ...selectedConditionMap,
              ...childSelectedConditionMap,
            });

            const valueWOParentDotPath = dot.getter(defaultValue, tree.path);
            append(valueWOParentDotPath);
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
};
