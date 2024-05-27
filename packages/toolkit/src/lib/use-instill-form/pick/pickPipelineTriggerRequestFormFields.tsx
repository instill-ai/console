import { UseFormReturn } from "react-hook-form";
import { Nullable } from "../../type";
import { TriggerRequestFormFields } from "../components";
import { FieldMode, StartOperatorFreeFormFieldItem } from "../types";
import { PipelineVariableFieldMap } from "../../vdp-sdk";

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
}: PickPipelineTriggerRequestFormFieldsProps) {
  const items: StartOperatorFreeFormFieldItem[] = [];

  if (!fields) return [];

  // The reason we don't directly return the components at the item of the array
  // is we want to sort the fields by the order of `instillUIOrder` property.

  for (const [key, value] of Object.entries(fields)) {
    switch (value.instill_format) {
      case "string":
        if (value.instill_ui_multiline) {
          items.push({
            key,
            instillUIOrder: value.instill_ui_order,
            component: (
              <TriggerRequestFormFields.TextareaField
                mode={mode}
                key={key}
                form={form}
                path={key}
                title={value.title}
                onDeleteField={onDeleteField}
                onEditField={onEditField}
                description={value.description ?? null}
                disabled={disabledFields}
                keyPrefix={keyPrefix}
                disabledFieldControl={disabledFieldControls}
                disabledReferenceHint={disabledReferenceHint}
                instillFormat={value.instill_format}
              />
            ),
          });
        } else {
          items.push({
            key,
            instillUIOrder: value.instill_ui_order,
            component: (
              <TriggerRequestFormFields.TextField
                mode={mode}
                key={key}
                form={form}
                path={key}
                title={value.title}
                onDeleteField={onDeleteField}
                onEditField={onEditField}
                description={value.description ?? null}
                disabled={disabledFields}
                keyPrefix={keyPrefix}
                disabledFieldControl={disabledFieldControls}
                disabledReferenceHint={disabledReferenceHint}
                instillFormat={value.instill_format}
              />
            ),
          });
        }
        break;
      case "array:string": {
        items.push({
          key,
          instillUIOrder: value.instill_ui_order,
          component: (
            <TriggerRequestFormFields.TextsField
              mode={mode}
              key={key}
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
              disabledReferenceHint={disabledReferenceHint}
              instillFormat={value.instill_format}
            />
          ),
        });
        break;
      }
      case "boolean":
        items.push({
          key,
          instillUIOrder: value.instill_ui_order,
          component: (
            <TriggerRequestFormFields.BooleanField
              mode={mode}
              key={key}
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
              disabledReferenceHint={disabledReferenceHint}
              instillFormat={value.instill_format}
            />
          ),
        });
        break;
      case "number":
        items.push({
          key,
          instillUIOrder: value.instill_ui_order,
          component: (
            <TriggerRequestFormFields.NumberField
              mode={mode}
              key={key}
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
              disabledReferenceHint={disabledReferenceHint}
              instillFormat={value.instill_format}
            />
          ),
        });
        break;
      case "array:number":
        items.push({
          key,
          instillUIOrder: value.instill_ui_order,
          component: (
            <TriggerRequestFormFields.NumbersField
              mode={mode}
              key={key}
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
              disabledReferenceHint={disabledReferenceHint}
              instillFormat={value.instill_format}
            />
          ),
        });
        break;
      case "audio/*":
        items.push({
          key,
          instillUIOrder: value.instill_ui_order,
          component: (
            <TriggerRequestFormFields.AudioField
              mode={mode}
              key={key}
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
              disabledReferenceHint={disabledReferenceHint}
              instillFormat={value.instill_format}
            />
          ),
        });
        break;
      case "array:audio/*":
        items.push({
          key,
          instillUIOrder: value.instill_ui_order,
          component: (
            <TriggerRequestFormFields.AudiosField
              mode={mode}
              key={key}
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
              disabledReferenceHint={disabledReferenceHint}
              instillFormat={value.instill_format}
            />
          ),
        });
        break;
      case "image/*":
        items.push({
          key,
          instillUIOrder: value.instill_ui_order,
          component: (
            <TriggerRequestFormFields.ImageField
              mode={mode}
              key={key}
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
              disabledReferenceHint={disabledReferenceHint}
              instillFormat={value.instill_format}
            />
          ),
        });
        break;
      case "array:image/*":
        items.push({
          key,
          instillUIOrder: value.instill_ui_order,
          component: (
            <TriggerRequestFormFields.ImagesField
              mode={mode}
              key={key}
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
              disabledReferenceHint={disabledReferenceHint}
              instillFormat={value.instill_format}
            />
          ),
        });
        break;

      case "video/*":
        items.push({
          key,
          instillUIOrder: value.instill_ui_order,
          component: (
            <TriggerRequestFormFields.VideoField
              mode={mode}
              key={key}
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
              disabledReferenceHint={disabledReferenceHint}
              instillFormat={value.instill_format}
            />
          ),
        });
        break;
      case "array:video/*":
        items.push({
          key,
          instillUIOrder: value.instill_ui_order,
          component: (
            <TriggerRequestFormFields.VideosField
              mode={mode}
              key={key}
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
              disabledReferenceHint={disabledReferenceHint}
              instillFormat={value.instill_format}
            />
          ),
        });
        break;
      case "*/*":
        items.push({
          key,
          instillUIOrder: value.instill_ui_order,
          component: (
            <TriggerRequestFormFields.FileField
              mode={mode}
              key={key}
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
              disabledReferenceHint={disabledReferenceHint}
              instillFormat={value.instill_format}
            />
          ),
        });
        break;
      case "array:*/*":
        items.push({
          key,
          instillUIOrder: value.instill_ui_order,
          component: (
            <TriggerRequestFormFields.FilesField
              mode={mode}
              key={key}
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
              disabledReferenceHint={disabledReferenceHint}
              instillFormat={value.instill_format}
            />
          ),
        });
        break;
      case "semi-structured/json":
        items.push({
          key,
          instillUIOrder: value.instill_ui_order,
          component: (
            <TriggerRequestFormFields.ObjectField
              mode={mode}
              key={key}
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
              disabledReferenceHint={disabledReferenceHint}
              instillFormat={value.instill_format}
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
