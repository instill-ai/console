import { UseFormReturn } from "react-hook-form";
import { Nullable } from "../../type";
import { PipelineStartComponentFields } from "../../vdp-sdk";
import { StartOperatorFreeFormFields } from "../components";
import { FieldMode, StartOperatorFreeFormFieldItem } from "../types";

export type PickStartOperatorFreeFormFieldItemsProps = {
  mode: FieldMode;

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  form: UseFormReturn<{ [k: string]: any }, any, undefined>;
  onEditField?: (key: string) => void;
  onDeleteField?: (key: string) => void;
  keyPrefix?: string;
  disabledFields?: boolean;
  disabledFieldControls?: boolean;
  disabledReferenceHint?: boolean;
  fields: Nullable<PipelineStartComponentFields>;
};

export function pickStartOperatorFreeFormFieldItems({
  mode,
  fields,
  form,
  onEditField,
  onDeleteField,
  disabledFields,
  disabledFieldControls,
  keyPrefix,
  disabledReferenceHint,
}: PickStartOperatorFreeFormFieldItemsProps) {
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
              <StartOperatorFreeFormFields.TextareaField
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
              <StartOperatorFreeFormFields.TextField
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
            <StartOperatorFreeFormFields.TextsField
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
            <StartOperatorFreeFormFields.BooleanField
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
            <StartOperatorFreeFormFields.NumberField
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
            <StartOperatorFreeFormFields.NumbersField
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
            <StartOperatorFreeFormFields.AudioField
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
            <StartOperatorFreeFormFields.AudiosField
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
            <StartOperatorFreeFormFields.ImageField
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
            <StartOperatorFreeFormFields.ImagesField
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
            <StartOperatorFreeFormFields.VideoField
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
            <StartOperatorFreeFormFields.VideosField
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
            <StartOperatorFreeFormFields.FileField
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
            <StartOperatorFreeFormFields.FilesField
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
            <StartOperatorFreeFormFields.ObjectField
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
