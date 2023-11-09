import * as React from "react";
import { InstillFormTree, SelectedConditionMap } from "../type";
import { RegularFields } from "../components";
import { GeneralUseFormReturn } from "../../type";
import { SmartHintFields } from "../components/smart-hint";

export type PickRegularFieldsFromInstillFormTreeOptions = {
  disabledAll?: boolean;
  checkIsHiddenByTree?: (tree: InstillFormTree) => boolean;

  // By default we will choose title from title field in JSON schema
  chooseTitleFrom?: "title" | "key";
  enableSmartHint?: boolean;
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
  const enableSmartHint = options?.enableSmartHint ?? false;

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
            options
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
            options
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
            options
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
        conditionComponentsMap={conditionComponents}
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
          options
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

  if (tree.type === "string" && tree.instillUiMultiline) {
    if (enableSmartHint) {
      return (
        <SmartHintFields.TextArea
          key={tree.path}
          path={tree.path}
          form={form}
          title={title}
          description={tree.description}
          shortDescription={tree.instillShortDescription}
          disabled={disabledAll}
          instillAcceptFormats={tree.instillAcceptFormats ?? []}
          isRequired={tree.isRequired}
          instillUpstreamTypes={tree.instillUpstreamTypes ?? []}
        />
      );
    }

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

  if (enableSmartHint) {
    return (
      <SmartHintFields.TextField
        key={tree.path}
        path={tree.path}
        form={form}
        title={title}
        description={tree.description}
        shortDescription={tree.instillShortDescription}
        disabled={disabledAll}
        instillAcceptFormats={tree.instillAcceptFormats ?? []}
        isRequired={tree.isRequired}
        instillUpstreamTypes={tree.instillUpstreamTypes ?? []}
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
    />
  );
}
