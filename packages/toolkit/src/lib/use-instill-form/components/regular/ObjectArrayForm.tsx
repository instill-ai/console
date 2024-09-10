import * as React from "react";
import { GeneralRecord } from "instill-sdk";
import { useFieldArray } from "react-hook-form";

import { Button, cn, Icons } from "@instill-ai/design-system";

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

  const fieldTitle = tree.title ?? tree.fieldKey ?? "Item";

  return (
    <div className="flex flex-col gap-y-1">
      {/* <div className="flex flex-row gap-x-1 w-full overflow-x-auto">
        {fields.map((field, index) => (
          <button
            type="button"
            className={cn(
              "flex px-1 pt-1 pb-2 border-b border-semantic-accent-default product-body-text-3-semibold",
              selectedFieldId === field.id
                ? "border-opacity-100"
                : "border-opacity-0",
            )}
            style={{
              color: "#5F6D86",
            }}
            key={field.id}
            onClick={() => {
              setSelectedFieldId(field.id);
            }}
          >
            {fieldTitle + index + 1}
          </button>
        ))}
      </div> */}
      <div className="flex mb-3 flex-col gap-y-5">
        {fields.map((field, index) => (
          <div key={field.id} className="flex flex-col">
            <div className="flex flex-row justify-between">
              <div className="flex mb-3 flex-row gap-x-1 product-body-text-2-semibold text-semantic-fg-primary">
                <p>{fieldTitle}</p>
                <p>{index + 1}</p>
              </div>
              {fields.length === 1 ? null : (
                <Button
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
                        newSelectedConditionMap[item] =
                          selectedConditionMap[item];
                      }
                    });

                    propsToUpdate.forEach((item) => {
                      if (selectedConditionMap) {
                        const number = parseInt(
                          item.replace(`${path}.`, "").split(".")[0] || "",
                          10,
                        );
                        const suffix = item.replace(`${path}.${number}.`, "");

                        newSelectedConditionMap[
                          `${path}.${number - 1}.${suffix}`
                        ] = selectedConditionMap[`${path}.${number}.${suffix}`];
                      }
                    });

                    setSelectedConditionMap(newSelectedConditionMap);

                    remove(index);
                  }}
                  variant="tertiaryGrey"
                  className="!p-1"
                >
                  <Icons.X className="w-5 h-5 stroke-semantic-fg-primary" />
                </Button>
              )}
            </div>

            <div
              className={cn(
                "flex pl-4 border-l-2 gap-y-3 border-semantic-bg-line flex-col",
              )}
              key={field.id}
            >
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
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-row w-full">
        <button
          className="flex rounded border border-semantic-bg-line py-[9px] gap-x-2 flex-row justify-center items-center w-full product-button-button-2 text-semantic-fg-primary"
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
          <Icons.Plus className="w-[14px] h-[14px] stroke-semantic-fg-primary" />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
};
