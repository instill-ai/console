import * as React from "react";
import { InstillFormTree, SelectedConditionMap } from "../type";
import { RegularFields } from "../components";
import { GeneralUseFormReturn } from "../../type";

export type PickRegularFieldsFromInstillFormTreeOptions = {
  disabledAll?: boolean;
  checkIsHiddenByTree?: (tree: InstillFormTree) => boolean;

  // By default we will choose title from title field in JSON schema
  chooseTitleFrom?: "title" | "key";
};

export function pickRegularFieldsFromInstillFormTree(
  tree: InstillFormTree,
  form: GeneralUseFormReturn,
  selectedConditionMap: SelectedConditionMap | null,
  setSelectedConditionMap: React.Dispatch<
    React.SetStateAction<SelectedConditionMap | null>
  >,
  options?: PickRegularFieldsFromInstillFormTreeOptions
): React.ReactNode {
  const disabledAll = options?.disabledAll ?? false;
  const checkIsHiddenByTree = options?.checkIsHiddenByTree ?? undefined;
  const chooseTitleFrom = options?.chooseTitleFrom ?? "title";

  let title = tree.title ?? tree.fieldKey ?? null;

  if (chooseTitleFrom === "key") {
    title = tree.fieldKey ?? null;
  }

  if (tree.isHidden) {
    return null;
  }

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
          return pickRegularFieldsFromInstillFormTree(
            property,
            form,
            selectedConditionMap,
            setSelectedConditionMap,
            {
              disabledAll,
              checkIsHiddenByTree,
              chooseTitleFrom,
            }
          );
        })}
      </div>
    ) : (
      <React.Fragment key={tree.path || tree.fieldKey}>
        {tree.properties.map((property) => {
          return pickRegularFieldsFromInstillFormTree(
            property,
            form,
            selectedConditionMap,
            setSelectedConditionMap,
            {
              disabledAll,
              checkIsHiddenByTree,
              chooseTitleFrom,
            }
          );
        })}
      </React.Fragment>
    );
  }

  if (checkIsHiddenByTree && checkIsHiddenByTree(tree)) {
    return null;
  }

  if (tree._type === "formCondition") {
    const conditionComponents = Object.fromEntries(
      Object.entries(tree.conditions).map(([k, v]) => {
        return [
          k,
          pickRegularFieldsFromInstillFormTree(
            v,
            form,
            selectedConditionMap,
            setSelectedConditionMap,
            {
              disabledAll,
              checkIsHiddenByTree,
              chooseTitleFrom,
            }
          ),
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
      <RegularFields.OneOfConditionField
        form={form}
        path={constField.path}
        tree={tree}
        selectedConditionMap={selectedConditionMap}
        setSelectedConditionMap={setSelectedConditionMap}
        key={constField.path}
        conditionComponents={conditionComponents}
        title={title}
        shortDescription={tree.instillShortDescription}
        disabled={disabledAll}
      />
    );
  }

  if (tree._type === "objectArray") {
    return (
      <React.Fragment key={tree.path || tree.fieldKey}>
        {pickRegularFieldsFromInstillFormTree(
          tree.properties,
          form,
          selectedConditionMap,
          setSelectedConditionMap,
          {
            disabledAll,
            checkIsHiddenByTree,
            chooseTitleFrom,
          }
        )}
      </React.Fragment>
    );
  }

  if (tree.const || !tree.path) {
    return null;
  }

  if (tree.type === "boolean") {
    return (
      <RegularFields.BooleanField
        key={tree.path}
        path={tree.path}
        title={title}
        form={form}
        description={tree.description}
        shortDescription={tree.instillShortDescription}
        disabled={disabledAll}
      />
    );
  }

  if (tree.type === "string" && tree.enum && tree.enum.length > 0) {
    return (
      <RegularFields.SingleSelectField
        key={tree.path}
        path={tree.path}
        form={form}
        title={title}
        options={tree.enum}
        description={tree.description}
        shortDescription={tree.instillShortDescription}
        disabled={disabledAll}
      />
    );
  }

  if (tree.type === "string" && tree.isMultiline) {
    return (
      <RegularFields.TextAreaField
        key={tree.path}
        path={tree.path}
        form={form}
        title={title}
        description={tree.description}
        shortDescription={tree.instillShortDescription}
        disabled={disabledAll}
      />
    );
  }

  if (tree.instillCredentialField) {
    return (
      <RegularFields.CredentialTextField
        key={tree.path}
        path={tree.path}
        form={form}
        title={title}
        description={tree.description}
        shortDescription={tree.instillShortDescription}
        disabled={disabledAll}
      />
    );
  }

  return (
    <RegularFields.TextField
      key={tree.path}
      path={tree.path}
      form={form}
      title={title}
      description={tree.description}
      shortDescription={tree.instillShortDescription}
      disabled={disabledAll}
      instillAcceptFormats={tree.instillAcceptFormats ?? []}
      type={tree.type}
      isRequired={tree.isRequired}
    />
  );
}
