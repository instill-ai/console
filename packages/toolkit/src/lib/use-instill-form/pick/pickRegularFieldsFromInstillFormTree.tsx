import cn from "clsx";
import * as React from "react";
import {
  ChooseTitleFrom,
  InstillFormTree,
  SelectedConditionMap,
} from "../types";
import { RegularFields } from "../components";
import { GeneralUseFormReturn, Nullable } from "../../type";
import { SmartHintFields } from "../components/smart-hint";

export type PickRegularFieldsFromInstillFormTreeOptions = {
  disabledAll?: boolean;
  // By default we will choose title from title field in JSON schema
  chooseTitleFrom?: ChooseTitleFrom;
  enableSmartHint?: boolean;
  componentID?: string;
  size?: "sm";
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
  const chooseTitleFrom = options?.chooseTitleFrom ?? "title";
  const enableSmartHint = options?.enableSmartHint ?? false;
  const componentID = options?.componentID ?? "";
  const size = options?.size;

  let title: Nullable<string> = null;

  if (chooseTitleFrom === "title") {
    title = tree.title ?? tree.fieldKey;
  } else if (chooseTitleFrom === "key") {
    title = tree.fieldKey ?? tree.title ?? null;
  } else {
    title = tree.path ?? tree.fieldKey ?? tree.title ?? null;
  }

  if (tree._type === "formGroup") {
    // If all the following child in this formGroup is hidden, we will not
    // render this formGroup

    const childAreAllHidden = tree.properties.every((property) => {
      return property.isHidden;
    });

    if (childAreAllHidden) {
      return null;
    }

    return tree.fieldKey ? (
      <div key={tree.path || tree.fieldKey}>
        <p
          className={cn(
            "mb-2 text-semantic-fg-primary",
            size === "sm"
              ? "product-body-text-4-medium"
              : "product-body-text-3-medium"
          )}
        >
          {title}
        </p>
        <div
          className={cn(
            "flex flex-col gap-y-4 border border-semantic-bg-line",
            size === "sm" ? "rounded p-2" : "rounded-sm p-4"
          )}
        >
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

    const defaultConstField = tree.conditions[
      Object.keys(tree.conditions)[0]
    ].properties.find((e) => "const" in e);

    if (!defaultConstField?.path) {
      return null;
    }

    const selectedCondition = selectedConditionMap?.[defaultConstField?.path];

    let selectedConstField: InstillFormTree | undefined;

    if (selectedCondition) {
      selectedConstField = tree.conditions[selectedCondition].properties.find(
        (e) => "const" in e
      );
    }

    return (
      <RegularFields.OneOfConditionField
        form={form}
        path={defaultConstField.path}
        tree={tree}
        selectedConditionMap={selectedConditionMap}
        setSelectedConditionMap={setSelectedConditionMap}
        key={defaultConstField.path}
        conditionComponentsMap={conditionComponents}
        title={title}
        shortDescription={
          selectedConstField
            ? selectedConstField.instillShortDescription
            : defaultConstField.instillShortDescription
        }
        disabled={disabledAll}
        description={
          selectedConstField
            ? selectedConstField.description ?? null
            : defaultConstField.description ?? null
        }
        size={size}
        isHidden={tree.isHidden}
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

  if (tree._type === "arrayArray") {
    return (
      <React.Fragment key={tree.path || tree.fieldKey}>
        {pickRegularFieldsFromInstillFormTree(
          tree.items,
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
        description={tree.description ?? null}
        shortDescription={tree.instillShortDescription}
        disabled={disabledAll}
        size={size}
        isHidden={tree.isHidden}
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
        description={tree.description ?? null}
        shortDescription={tree.instillShortDescription}
        disabled={disabledAll}
        size={size}
        isHidden={tree.isHidden}
      />
    );
  }

  if (tree.type === "string" && tree.instillUIMultiline) {
    if (enableSmartHint) {
      return (
        <SmartHintFields.TextArea
          key={tree.path}
          path={tree.path}
          form={form}
          title={title}
          description={tree.description ?? null}
          shortDescription={tree.instillShortDescription}
          disabled={disabledAll}
          instillAcceptFormats={tree.instillAcceptFormats ?? []}
          isRequired={tree.isRequired}
          instillUpstreamTypes={tree.instillUpstreamTypes ?? []}
          componentID={componentID}
          size={size}
          isHidden={tree.isHidden}
        />
      );
    }

    return (
      <RegularFields.TextAreaField
        key={tree.path}
        path={tree.path}
        form={form}
        title={title}
        description={tree.description ?? null}
        shortDescription={tree.instillShortDescription}
        disabled={disabledAll}
        size={size}
        isHidden={tree.isHidden}
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
        description={tree.description ?? null}
        shortDescription={tree.instillShortDescription}
        disabled={disabledAll}
        size={size}
        isHidden={tree.isHidden}
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
        description={tree.description ?? null}
        shortDescription={tree.instillShortDescription}
        disabled={disabledAll}
        instillAcceptFormats={tree.instillAcceptFormats ?? []}
        isRequired={tree.isRequired}
        instillUpstreamTypes={tree.instillUpstreamTypes ?? []}
        componentID={componentID}
        size={size}
        isHidden={tree.isHidden}
      />
    );
  }

  return (
    <RegularFields.TextField
      key={tree.path}
      path={tree.path}
      form={form}
      title={title}
      description={tree.description ?? null}
      shortDescription={tree.instillShortDescription}
      disabled={disabledAll}
      size={size}
      isHidden={tree.isHidden}
    />
  );
}
