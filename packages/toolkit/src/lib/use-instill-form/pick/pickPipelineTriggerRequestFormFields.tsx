import type { PipelineVariableFieldMap } from "instill-sdk";
import { UseFormReturn } from "react-hook-form";

import { DocumentInputAcceptMimeTypes } from "../../../constant/pipeline";
import { Nullable } from "../../type";
import { TriggerRequestFormFields } from "../components";
import { FieldMode, StartOperatorFreeFormFieldItem } from "../types";

export type PickPipelineTriggerRequestFormFieldsProps = {
  mode: FieldMode;

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  form: UseFormReturn<{ [k: string]: any }, any, undefined>;
  onEditField?: (key: string) => void;
  onDeleteField?: (key: string) => void;
  keyPrefix?: string;
  disabledFields?: boolean;
  disabledFieldControls?: boolean;
  disabledReferenceHint?: boolean;
  fields: Nullable<PipelineVariableFieldMap>;
  forceStringMultiline?: boolean;
};

export function pickPipelineTriggerRequestFormFields({
  mode,
  fields,
  form,
  onEditField,
  onDeleteField,
  disabledFields,
  disabledFieldControls,
  keyPrefix,
  disabledReferenceHint,
  forceStringMultiline,
}: PickPipelineTriggerRequestFormFieldsProps) {
  const items: StartOperatorFreeFormFieldItem[] = [];

  if (!fields) return [];

  // The reason we don't directly return the components at the item of the array
  // is we want to sort the fields by the order of `instillUIOrder` property.

  for (const [key, value] of Object.entries(fields)) {
    // Skip the fields that don't have value or instillFormat
    if (!value || !value.instillFormat) continue;

    if (value.listen) {
      continue;
    }

    const title = value.title ?? key;

    switch (value.instillFormat) {
      case "string":
        if (value.instillUiMultiline || forceStringMultiline) {
          items.push({
            key,
            instillUIOrder: value.instillUiOrder,
            component: (
              <TriggerRequestFormFields.TextareaField
                mode={mode}
                key={key}
                form={form}
                path={key}
                title={title}
                onDeleteField={onDeleteField}
                onEditField={onEditField}
                description={value.description ?? null}
                disabled={disabledFields}
                keyPrefix={keyPrefix}
                disabledFieldControl={disabledFieldControls}
                disabledReferenceHint={disabledReferenceHint}
                instillFormat={value.instillFormat}
              />
            ),
          });
        } else {
          items.push({
            key,
            instillUIOrder: value.instillUiOrder,
            component: (
              <TriggerRequestFormFields.TextField
                mode={mode}
                key={key}
                form={form}
                path={key}
                title={title}
                onDeleteField={onDeleteField}
                onEditField={onEditField}
                description={value.description ?? null}
                disabled={disabledFields}
                keyPrefix={keyPrefix}
                disabledFieldControl={disabledFieldControls}
                disabledReferenceHint={disabledReferenceHint}
                instillFormat={value.instillFormat}
              />
            ),
          });
        }
        break;
      case "array:string": {
        if (forceStringMultiline) {
          items.push({
            key,
            instillUIOrder: value.instillUiOrder,
            component: (
              <TriggerRequestFormFields.TextareasField
                mode={mode}
                key={key}
                form={form}
                path={key}
                title={title}
                onDeleteField={onDeleteField}
                onEditField={onEditField}
                description={value.description ?? null}
                disabled={disabledFields}
                keyPrefix={keyPrefix}
                disabledFieldControl={disabledFieldControls}
                disabledReferenceHint={disabledReferenceHint}
                instillFormat={value.instillFormat}
              />
            ),
          });
        } else {
          items.push({
            key,
            instillUIOrder: value.instillUiOrder,
            component: (
              <TriggerRequestFormFields.TextsField
                mode={mode}
                key={key}
                form={form}
                path={key}
                title={title}
                onDeleteField={onDeleteField}
                onEditField={onEditField}
                description={value.description ?? null}
                disabled={disabledFields}
                keyPrefix={keyPrefix}
                disabledFieldControl={disabledFieldControls}
                disabledReferenceHint={disabledReferenceHint}
                instillFormat={value.instillFormat}
              />
            ),
          });
        }

        break;
      }
      case "boolean":
        items.push({
          key,
          instillUIOrder: value.instillUiOrder,
          component: (
            <TriggerRequestFormFields.BooleanField
              mode={mode}
              key={key}
              form={form}
              path={key}
              title={title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
              disabledReferenceHint={disabledReferenceHint}
              instillFormat={value.instillFormat}
            />
          ),
        });
        break;
      case "number":
        items.push({
          key,
          instillUIOrder: value.instillUiOrder,
          component: (
            <TriggerRequestFormFields.NumberField
              mode={mode}
              key={key}
              form={form}
              path={key}
              title={title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
              disabledReferenceHint={disabledReferenceHint}
              instillFormat={value.instillFormat}
            />
          ),
        });
        break;
      case "array:number":
        items.push({
          key,
          instillUIOrder: value.instillUiOrder,
          component: (
            <TriggerRequestFormFields.NumbersField
              mode={mode}
              key={key}
              form={form}
              path={key}
              title={title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
              disabledReferenceHint={disabledReferenceHint}
              instillFormat={value.instillFormat}
            />
          ),
        });
        break;
      case "audio":
      case "audio/*":
        items.push({
          key,
          instillUIOrder: value.instillUiOrder,
          component: (
            <TriggerRequestFormFields.AudioField
              mode={mode}
              key={key}
              form={form}
              path={key}
              title={title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
              disabledReferenceHint={disabledReferenceHint}
              instillFormat={value.instillFormat}
            />
          ),
        });
        break;
      case "array:audio":
      case "array:audio/*":
        items.push({
          key,
          instillUIOrder: value.instillUiOrder,
          component: (
            <TriggerRequestFormFields.AudiosField
              mode={mode}
              key={key}
              form={form}
              path={key}
              title={title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
              disabledReferenceHint={disabledReferenceHint}
              instillFormat={value.instillFormat}
            />
          ),
        });
        break;
      case "image":
      case "image/*":
        items.push({
          key,
          instillUIOrder: value.instillUiOrder,
          component: (
            <TriggerRequestFormFields.ImageField
              mode={mode}
              key={key}
              form={form}
              path={key}
              title={title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
              disabledReferenceHint={disabledReferenceHint}
              instillFormat={value.instillFormat}
            />
          ),
        });
        break;
      case "array:image":
      case "array:image/*":
        items.push({
          key,
          instillUIOrder: value.instillUiOrder,
          component: (
            <TriggerRequestFormFields.ImagesField
              mode={mode}
              key={key}
              form={form}
              path={key}
              title={title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
              disabledReferenceHint={disabledReferenceHint}
              instillFormat={value.instillFormat}
            />
          ),
        });
        break;

      case "video":
      case "video/*":
        items.push({
          key,
          instillUIOrder: value.instillUiOrder,
          component: (
            <TriggerRequestFormFields.VideoField
              mode={mode}
              key={key}
              form={form}
              path={key}
              title={title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
              disabledReferenceHint={disabledReferenceHint}
              instillFormat={value.instillFormat}
            />
          ),
        });
        break;
      case "array:video":
      case "array:video/*":
        items.push({
          key,
          instillUIOrder: value.instillUiOrder,
          component: (
            <TriggerRequestFormFields.VideosField
              mode={mode}
              key={key}
              form={form}
              path={key}
              title={title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
              disabledReferenceHint={disabledReferenceHint}
              instillFormat={value.instillFormat}
            />
          ),
        });
        break;
      case "file":
      case "*/*":
        items.push({
          key,
          instillUIOrder: value.instillUiOrder,
          component: (
            <TriggerRequestFormFields.FileField
              mode={mode}
              key={key}
              form={form}
              path={key}
              title={title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
              disabledReferenceHint={disabledReferenceHint}
              instillFormat={value.instillFormat}
              accept="*/*"
            />
          ),
        });
        break;
      case "array:file":
      case "array:*/*":
        items.push({
          key,
          instillUIOrder: value.instillUiOrder,
          component: (
            <TriggerRequestFormFields.FilesField
              mode={mode}
              key={key}
              form={form}
              path={key}
              title={title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
              disabledReferenceHint={disabledReferenceHint}
              instillFormat={value.instillFormat}
              accept="*/*"
            />
          ),
        });
        break;
      case "document":
        items.push({
          key,
          instillUIOrder: value.instillUiOrder,
          component: (
            <TriggerRequestFormFields.FileField
              mode={mode}
              key={key}
              form={form}
              path={key}
              title={title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
              disabledReferenceHint={disabledReferenceHint}
              instillFormat={value.instillFormat}
              accept={DocumentInputAcceptMimeTypes.join(",")}
            />
          ),
        });
        break;
      case "array:document":
        items.push({
          key,
          instillUIOrder: value.instillUiOrder,
          component: (
            <TriggerRequestFormFields.FilesField
              mode={mode}
              key={key}
              form={form}
              path={key}
              title={title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
              disabledReferenceHint={disabledReferenceHint}
              instillFormat={value.instillFormat}
              accept={DocumentInputAcceptMimeTypes.join(",")}
            />
          ),
        });
        break;
      case "json":
      case "semi-structured/json":
        items.push({
          key,
          instillUIOrder: value.instillUiOrder,
          component: (
            <TriggerRequestFormFields.ObjectField
              mode={mode}
              key={key}
              form={form}
              path={key}
              title={title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
              disabledReferenceHint={disabledReferenceHint}
              instillFormat={value.instillFormat}
            />
          ),
        });

        break;
      default:
        break;
    }
  }

  return items
    .sort((a, b) => {
      if (typeof a.instillUIOrder === "undefined") {
        return 1;
      }

      if (typeof b.instillUIOrder === "undefined") {
        return -1;
      }

      return a.instillUIOrder > b.instillUIOrder ? 1 : -1;
    })
    .map((e) => e.component);
}
