import type { Secret } from "instill-sdk";
import * as React from "react";
import cn from "clsx";

import { GeneralUseFormReturn, Nullable } from "../../type";
import { RegularFields } from "../components";
import { ObjectArrayForm } from "../components/regular/ObjectArrayForm";
import { SmartHintFields } from "../components/smart-hint";
import {
  ChooseTitleFrom,
  InstillFormTree,
  SelectedConditionMap,
} from "../types";
import { pickDefaultCondition } from "./pickDefaultCondition";

export type PickRegularFieldsFromInstillFormTreeOptions = {
  disabledAll?: boolean;
  // By default we will choose title from title field in JSON schema
  chooseTitleFrom?: ChooseTitleFrom;
  enableSmartHint?: boolean;
  componentID?: string;
  size?: "sm";
  secrets?: Secret[];
  enabledCollapsibleFormGroup?: boolean;
  collapsibleDefaultOpen?: boolean;
  forceCloseCollapsibleFormGroups?: string[];
  updateForceCloseCollapsibleFormGroups?: React.Dispatch<
    React.SetStateAction<string[]>
  >;
  forceOpenCollapsibleFormGroups?: string[];
  updateForceOpenCollapsibleFormGroups?: React.Dispatch<
    React.SetStateAction<string[]>
  >;
  supportInstillCredit?: boolean;
  updateSupportInstillCredit?: React.Dispatch<React.SetStateAction<boolean>>;
  updateIsUsingInstillCredit?: React.Dispatch<React.SetStateAction<boolean>>;
  parentIsObjectArray?: boolean;
  objectArrayIndex?: number;
  parentPath?: string;
  parentIsFormCondition?: boolean;
};

export function pickRegularFieldsFromInstillFormTree(
  tree: InstillFormTree,
  form: GeneralUseFormReturn,
  selectedConditionMap: SelectedConditionMap | null,
  setSelectedConditionMap: React.Dispatch<
    React.SetStateAction<SelectedConditionMap | null>
  >,
  options?: PickRegularFieldsFromInstillFormTreeOptions,
): React.ReactNode {
  const disabledAll = options?.disabledAll ?? false;
  const chooseTitleFrom = options?.chooseTitleFrom ?? "title";
  const enableSmartHint = options?.enableSmartHint ?? false;
  const componentID = options?.componentID ?? "";
  const size = options?.size;
  const secrets = options?.secrets ?? [];
  const supportInstillCredit = options?.supportInstillCredit ?? false;
  const updateSupportInstillCredit =
    options?.updateSupportInstillCredit ?? undefined;

  const enabledCollapsibleFormGroup =
    options?.enabledCollapsibleFormGroup ?? false;
  const collapsibleDefaultOpen = options?.collapsibleDefaultOpen ?? true;
  const forceCloseCollapsibleFormGroups =
    options?.forceCloseCollapsibleFormGroups ?? [];
  const updateForceCloseCollapsibleFormGroups =
    options?.updateForceCloseCollapsibleFormGroups;
  const forceOpenCollapsibleFormGroups =
    options?.forceOpenCollapsibleFormGroups ?? [];
  const updateForceOpenCollapsibleFormGroups =
    options?.updateForceOpenCollapsibleFormGroups;
  const updateIsUsingInstillCredit = options?.updateIsUsingInstillCredit;
  const parentIsObjectArray = options?.parentIsObjectArray ?? false;
  const objectArrayIndex = options?.objectArrayIndex ?? undefined;
  const parentPath = options?.parentPath ?? undefined;
  const parentIsFormCondition = options?.parentIsFormCondition ?? false;

  let title: Nullable<string> = null;

  if (chooseTitleFrom === "title") {
    title = tree.title ?? tree.fieldKey;
  } else if (chooseTitleFrom === "key") {
    title = tree.fieldKey ?? tree.title ?? null;
  } else {
    title = tree.path ?? tree.fieldKey ?? tree.title ?? null;
  }

  let modifiedPath = tree.path;

  const parentPathArray = parentPath ? parentPath.split(".") : [];

  if (parentIsObjectArray) {
    if (parentPath && tree.fieldKey) {
      const modifiedPathArray = [...parentPathArray, `${objectArrayIndex}`];
      modifiedPath = modifiedPathArray.join(".");
    }
  } else {
    if (parentPath && tree.fieldKey) {
      if (parentIsFormCondition) {
        const modifiedPathArray = [...parentPathArray];
        modifiedPath = modifiedPathArray.join(".");
      } else {
        const modifiedPathArray = [...parentPathArray, tree.fieldKey];
        modifiedPath = modifiedPathArray.join(".");
      }
    }
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

    // Airbyte schema will have a scenario that under their oneOf properties
    // there is only one const field, we don't need to render it's corresponding
    // formGroup title
    if (
      tree.properties.length === 1 &&
      tree.properties[0] &&
      "const" in tree.properties[0]
    ) {
      return null;
    }

    if (!tree.fieldKey) {
      return (
        <React.Fragment key={modifiedPath || tree.fieldKey}>
          {tree.properties.map((property) => {
            return pickRegularFieldsFromInstillFormTree(
              property,
              form,
              selectedConditionMap,
              setSelectedConditionMap,
              {
                ...options,
                parentPath: modifiedPath ?? undefined,
                objectArrayIndex: undefined,
                parentIsObjectArray: false,
                parentIsFormCondition: false,
              },
            );
          })}
        </React.Fragment>
      );
    }

    if (enabledCollapsibleFormGroup) {
      return (
        <RegularFields.CollapsibleFormGroup
          path={modifiedPath || tree.fieldKey}
          title={title}
          defaultOpen={collapsibleDefaultOpen}
          forceCloseCollapsibleFormGroups={forceCloseCollapsibleFormGroups}
          updateForceCloseCollapsibleFormGroups={
            updateForceCloseCollapsibleFormGroups
          }
          forceOpenCollapsibleFormGroups={forceOpenCollapsibleFormGroups}
          updateForceOpenCollapsibleFormGroups={
            updateForceOpenCollapsibleFormGroups
          }
        >
          {tree.properties.map((property) => {
            return pickRegularFieldsFromInstillFormTree(
              property,
              form,
              selectedConditionMap,
              setSelectedConditionMap,
              {
                // We only enable collapsible form group for the first level
                ...options,
                enabledCollapsibleFormGroup: false,
                parentPath: modifiedPath ?? undefined,
                objectArrayIndex: undefined,
                parentIsObjectArray: false,
                parentIsFormCondition: false,
              },
            );
          })}
        </RegularFields.CollapsibleFormGroup>
      );
    }

    return (
      <div key={modifiedPath || tree.fieldKey}>
        <p
          className={cn(
            "mb-2 text-semantic-fg-primary",
            size === "sm"
              ? "product-body-text-4-medium"
              : "product-body-text-3-medium",
          )}
        >
          {title}
        </p>
        <div className={cn("flex flex-col gap-y-4")}>
          {tree.properties.map((property) => {
            return pickRegularFieldsFromInstillFormTree(
              property,
              form,
              selectedConditionMap,
              setSelectedConditionMap,
              {
                ...options,
                parentPath: modifiedPath ?? undefined,
                objectArrayIndex: undefined,
                parentIsObjectArray: false,
                parentIsFormCondition: false,
              },
            );
          })}
        </div>
      </div>
    );
  }

  if (tree._type === "formCondition") {
    const conditionComponents = Object.fromEntries(
      Object.entries(tree.conditions).map(([k, v]) => {
        const constInfo = v.properties.find((e) => "const" in e);

        return [
          k,
          {
            component: pickRegularFieldsFromInstillFormTree(
              v,
              form,
              selectedConditionMap,
              setSelectedConditionMap,
              {
                ...options,
                parentPath: modifiedPath ?? undefined,
                objectArrayIndex: undefined,
                parentIsObjectArray: false,
                parentIsFormCondition: true,
              },
            ),
            title: constInfo?.title ?? null,
          },
        ];
      }),
    );

    // We will use the const path as the OneOfConditionField's path
    const defaultCondition = pickDefaultCondition(tree);

    if (!defaultCondition?.path) {
      return null;
    }

    const selectedCondition = selectedConditionMap?.[defaultCondition.path];

    let selectedConstField: InstillFormTree | undefined;

    if (selectedCondition && tree.conditions[selectedCondition]) {
      selectedConstField = tree.conditions[selectedCondition]?.properties.find(
        (e) => "const" in e,
      );
    }

    if (!modifiedPath || !defaultCondition.fieldKey) {
      return null;
    }

    return (
      <RegularFields.OneOfConditionField
        form={form}
        formConditionLayerPath={modifiedPath}
        constFullPath={modifiedPath + "." + defaultCondition.fieldKey}
        tree={tree}
        selectedConditionMap={selectedConditionMap}
        setSelectedConditionMap={setSelectedConditionMap}
        key={defaultCondition.path}
        conditionComponentsMap={conditionComponents}
        title={title}
        shortDescription={
          selectedConstField
            ? selectedConstField.instillShortDescription
            : defaultCondition.instillShortDescription
        }
        disabled={disabledAll}
        description={
          selectedConstField
            ? (selectedConstField.description ?? null)
            : (defaultCondition.description ?? null)
        }
        size={size}
        isHidden={tree.isHidden}
      />
    );
  }

  if (tree._type === "objectArray") {
    if (modifiedPath) {
      return (
        <ObjectArrayForm
          form={form}
          path={modifiedPath}
          tree={tree}
          options={options}
          selectedConditionMap={selectedConditionMap}
          setSelectedConditionMap={setSelectedConditionMap}
          parentPath={modifiedPath}
        />
      );
    } else {
      return null;
    }
  }

  if (tree._type === "arrayArray") {
    return (
      <React.Fragment key={modifiedPath || tree.fieldKey}>
        {pickRegularFieldsFromInstillFormTree(
          tree.items,
          form,
          selectedConditionMap,
          setSelectedConditionMap,
          {
            ...options,
            parentPath: modifiedPath ?? undefined,
            objectArrayIndex: undefined,
            parentIsObjectArray: false,
            parentIsFormCondition: false,
          },
        )}
      </React.Fragment>
    );
  }

  if (tree.const || !modifiedPath) {
    return null;
  }

  // Deal with using the auto-gen-form structure to generate regular fields instead
  // of the reference structure of pipeline-builder
  if (
    !tree.instillUpstreamTypes ||
    (tree.instillUpstreamTypes.length === 1 &&
      tree.instillUpstreamTypes[0] === "value")
  ) {
    if (tree.instillAcceptFormats && tree.instillAcceptFormats.length > 0) {
      if (tree.instillAcceptFormats[0]?.includes("array:image")) {
        return (
          <RegularFields.ImagesField
            key={tree.path}
            path={modifiedPath}
            title={title}
            form={form}
            description={tree.description ?? null}
            shortDescription={tree.instillShortDescription}
            disabled={disabledAll}
            size={size}
            isHidden={tree.isHidden}
            isRequired={tree.isRequired}
            instillModelPromptImageBase64ObjectFormat={
              tree.instillModelPromptImageBase64ObjectFormat
            }
          />
        );
      }

      if (tree.instillAcceptFormats[0]?.includes("image")) {
        return (
          <RegularFields.ImageField
            key={modifiedPath}
            path={modifiedPath}
            title={title}
            form={form}
            description={tree.description ?? null}
            shortDescription={tree.instillShortDescription}
            disabled={disabledAll}
            size={size}
            isHidden={tree.isHidden}
            isRequired={tree.isRequired}
          />
        );
      }
    }
  }

  if (tree.type === "boolean") {
    return (
      <RegularFields.BooleanField
        key={modifiedPath}
        path={modifiedPath}
        title={title}
        form={form}
        description={tree.description ?? null}
        shortDescription={tree.instillShortDescription}
        disabled={disabledAll}
        size={size}
        isHidden={tree.isHidden}
        isRequired={tree.isRequired}
      />
    );
  }

  if (tree.type === "string" && tree.enum && tree.enum.length > 0) {
    return (
      <RegularFields.SingleSelectField
        tree={tree}
        key={modifiedPath}
        path={modifiedPath}
        form={form}
        title={title}
        options={tree.enum}
        description={tree.description ?? null}
        shortDescription={tree.instillShortDescription}
        disabled={disabledAll}
        size={size}
        isHidden={tree.isHidden}
        isRequired={tree.isRequired}
        instillCredentialMap={tree.instillCredentialMap}
        updateSupportInstillCredit={updateSupportInstillCredit}
        updateIsUsingInstillCredit={updateIsUsingInstillCredit}
        updateForceCloseCollapsibleFormGroups={
          updateForceCloseCollapsibleFormGroups
        }
        updateForceOpenCollapsibleFormGroups={
          updateForceOpenCollapsibleFormGroups
        }
      />
    );
  }

  if (tree.type === "string" && tree.instillUIMultiline) {
    if (enableSmartHint) {
      return (
        <SmartHintFields.TextArea
          key={modifiedPath}
          path={modifiedPath}
          form={form}
          title={title}
          description={tree.description ?? null}
          shortDescription={tree.instillShortDescription}
          disabled={disabledAll}
          instillAcceptFormats={tree.instillAcceptFormats ?? []}
          instillUpstreamTypes={tree.instillUpstreamTypes ?? []}
          componentID={componentID}
          size={size}
          isHidden={tree.isHidden}
          isRequired={tree.isRequired}
          secrets={secrets}
          instillSecret={tree.instillSecret}
          instillCredential={tree.instillCredential}
          supportInstillCredit={supportInstillCredit}
          updateIsUsingInstillCredit={updateIsUsingInstillCredit}
        />
      );
    }

    return (
      <RegularFields.TextAreaField
        key={modifiedPath}
        path={modifiedPath}
        form={form}
        title={title}
        description={tree.description ?? null}
        shortDescription={tree.instillShortDescription}
        disabled={disabledAll}
        size={size}
        isHidden={tree.isHidden}
        isRequired={tree.isRequired}
      />
    );
  }

  if (enableSmartHint) {
    return (
      <SmartHintFields.TextField
        key={modifiedPath}
        path={modifiedPath}
        form={form}
        title={title}
        description={tree.description ?? null}
        shortDescription={tree.instillShortDescription}
        disabled={disabledAll}
        instillAcceptFormats={tree.instillAcceptFormats ?? []}
        instillUpstreamTypes={tree.instillUpstreamTypes ?? []}
        componentID={componentID}
        size={size}
        isHidden={tree.isHidden}
        isRequired={tree.isRequired}
        secrets={secrets}
        instillSecret={tree.instillSecret}
        instillCredential={tree.instillCredential}
        supportInstillCredit={supportInstillCredit}
        updateIsUsingInstillCredit={updateIsUsingInstillCredit}
      />
    );
  }

  return (
    <RegularFields.TextField
      key={modifiedPath}
      path={modifiedPath}
      form={form}
      title={title}
      description={tree.description ?? null}
      shortDescription={tree.instillShortDescription}
      disabled={disabledAll}
      size={size}
      isHidden={tree.isHidden}
      isRequired={tree.isRequired}
    />
  );
}
