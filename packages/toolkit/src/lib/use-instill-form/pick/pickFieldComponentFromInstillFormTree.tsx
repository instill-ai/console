import * as React from "react";
import { InstillFormTree, SelectedConditionMap } from "../type";
import {
  OneOfConditionField,
  BooleanField,
  SingleSelectField,
  TextAreaField,
  TextField,
} from "../components";
import { GeneralUseFormReturn } from "../../type";

export function pickFieldComponentFromInstillFormTree({
  form,
  tree,
  selectedConditionMap,
  setSelectedConditionMap,
  disabledAll,
  checkIsHiddenByFormTree,
}: {
  form: GeneralUseFormReturn;
  tree: InstillFormTree;
  selectedConditionMap: SelectedConditionMap | null;
  setSelectedConditionMap: React.Dispatch<
    React.SetStateAction<SelectedConditionMap | null>
  >;
  disabledAll?: boolean;
  checkIsHiddenByFormTree?: (tree: InstillFormTree) => boolean;
}): React.ReactNode {
  if (tree._type === "formGroup") {
    return tree.fieldKey ? (
      <div
        key={tree.path || tree.fieldKey}
        className="flex flex-col gap-y-4 rounded-sm border border-semantic-bg-line p-5"
      >
        <p className="text-semantic-fg-secondary product-body-text-2-semibold">
          {tree.fieldKey || tree.path}
        </p>
        {tree.properties.map((property) => {
          return pickFieldComponentFromInstillFormTree({
            form,
            tree: property,
            selectedConditionMap,
            setSelectedConditionMap,
            disabledAll,
            checkIsHiddenByFormTree,
          });
        })}
      </div>
    ) : (
      <React.Fragment key={tree.path || tree.fieldKey}>
        {tree.properties.map((property) => {
          return pickFieldComponentFromInstillFormTree({
            form,
            tree: property,
            selectedConditionMap,
            setSelectedConditionMap,
            disabledAll,
            checkIsHiddenByFormTree,
          });
        })}
      </React.Fragment>
    );
  }

  if (checkIsHiddenByFormTree && checkIsHiddenByFormTree(tree)) {
    return null;
  }

  if (tree._type === "formCondition") {
    const conditionComponents = Object.fromEntries(
      Object.entries(tree.conditions).map(([k, v]) => {
        return [
          k,
          pickFieldComponentFromInstillFormTree({
            tree: v,
            form,
            selectedConditionMap,
            setSelectedConditionMap,
            disabledAll,
            checkIsHiddenByFormTree,
          }),
        ];
      })
    );

    // We will use the const path as the OneOfConditionField's path

    const constField = tree.conditions[
      Object.keys(tree.conditions)[0]
    ].properties.find((e) => "const" in e);

    if (!constField?.path) {
      return null;
    }

    return (
      <OneOfConditionField
        form={form}
        path={constField.path}
        tree={tree}
        selectedConditionMap={selectedConditionMap}
        setSelectedConditionMap={setSelectedConditionMap}
        key={constField.path}
        conditionComponents={conditionComponents}
        title={constField.fieldKey ?? undefined}
        additionalDescription={tree.additionalDescription}
        disabled={disabledAll}
      />
    );
  }

  if (tree._type === "formArray") {
    return (
      <React.Fragment key={tree.path || tree.fieldKey}>
        {tree.properties.map((property) => {
          return pickFieldComponentFromInstillFormTree({
            form,
            tree: property,
            selectedConditionMap,
            setSelectedConditionMap,
            disabledAll,
            checkIsHiddenByFormTree,
          });
        })}
      </React.Fragment>
    );
  }

  if (tree.const || !tree.path) {
    return null;
  }

  if (tree.type === "boolean") {
    return (
      <BooleanField
        key={tree.path}
        path={tree.path}
        title={tree.fieldKey ?? tree.title ?? null}
        form={form}
        description={tree.description}
        additionalDescription={tree.additionalDescription}
        disabled={disabledAll}
      />
    );
  }

  if (tree.type === "string" && tree.enum && tree.enum.length > 0) {
    return (
      <SingleSelectField
        key={tree.path}
        path={tree.path}
        form={form}
        title={tree.fieldKey ?? tree.title ?? null}
        options={tree.enum}
        description={tree.description}
        additionalDescription={tree.additionalDescription}
        disabled={disabledAll}
      />
    );
  }

  if (tree.type === "string" && tree.isMultiline) {
    return (
      <TextAreaField
        key={tree.path}
        path={tree.path}
        form={form}
        title={tree.fieldKey ?? tree.title ?? null}
        description={tree.description}
        additionalDescription={tree.additionalDescription}
        disabled={disabledAll}
      />
    );
  }

  return (
    <TextField
      key={tree.path}
      path={tree.path}
      form={form}
      title={tree.fieldKey ?? tree.title ?? null}
      description={tree.description}
      additionalDescription={tree.additionalDescription}
      disabled={disabledAll}
    />
  );
}
