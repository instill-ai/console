import { UseFormReturn } from "react-hook-form";
import { Nullable } from "../../type";
import { StartOperatorMetadata } from "../../vdp-sdk";
import { StartOperatorFreeFormFields } from "../components";
import { StartOperatorFreeFormFieldItem } from "../type";

export function pickStartOperatorFreeFormFields({
  metadata,
  form,
  onEditField,
  onDeleteField,
  disabledFields,
  disabledFieldControls,
  keyPrefix,
}: {
  metadata: Nullable<StartOperatorMetadata>;
  form: UseFormReturn<{ [k: string]: any }, any, undefined>;
  onEditField?: (key: string) => void;
  onDeleteField?: (key: string) => void;
  disabledFields?: boolean;
  disabledFieldControls?: boolean;
  keyPrefix?: string;
}) {
  const fields: StartOperatorFreeFormFieldItem[] = [];

  if (!metadata) return [];

  // The reason we don't directly return the components at the item of the array
  // is we want to sort the fields by the order of `instillUIOrder` property.

  for (const [key, value] of Object.entries(metadata)) {
    switch (value.instillFormat) {
      case "string":
        if (value.instillUIMultiline) {
          fields.push({
            key,
            instillUIOrder: value.instillUiOrder,
            component: (
              <StartOperatorFreeFormFields.TextareaField
                form={form}
                path={key}
                title={value.title}
                onDeleteField={onDeleteField}
                onEditField={onEditField}
                description={value.description ?? null}
                disabled={disabledFields}
                keyPrefix={keyPrefix}
                disabledFieldControl={disabledFieldControls}
              />
            ),
          });
        } else {
          fields.push({
            key,
            instillUIOrder: value.instillUiOrder,
            component: (
              <StartOperatorFreeFormFields.TextField
                form={form}
                path={key}
                title={value.title}
                onDeleteField={onDeleteField}
                onEditField={onEditField}
                description={value.description ?? null}
                disabled={disabledFields}
                keyPrefix={keyPrefix}
                disabledFieldControl={disabledFieldControls}
              />
            ),
          });
        }
        break;
      case "array:string": {
        fields.push({
          key,
          instillUIOrder: value.instillUiOrder,
          component: (
            <StartOperatorFreeFormFields.TextsField
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
            />
          ),
        });
        break;
      }
      case "boolean":
        fields.push({
          key,
          instillUIOrder: value.instillUiOrder,
          component: (
            <StartOperatorFreeFormFields.BooleanField
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
            />
          ),
        });
        break;
      case "number":
        fields.push({
          key,
          instillUIOrder: value.instillUiOrder,
          component: (
            <StartOperatorFreeFormFields.NumberField
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
            />
          ),
        });
        break;
      case "array:number":
        fields.push({
          key,
          instillUIOrder: value.instillUiOrder,
          component: (
            <StartOperatorFreeFormFields.NumbersField
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
            />
          ),
        });
        break;
      case "audio/*":
        fields.push({
          key,
          instillUIOrder: value.instillUiOrder,
          component: (
            <StartOperatorFreeFormFields.AudioField
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
            />
          ),
        });
        break;
      case "array:audio/*":
        fields.push({
          key,
          instillUIOrder: value.instillUiOrder,
          component: (
            <StartOperatorFreeFormFields.AudiosField
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
            />
          ),
        });
        break;
      case "image/*":
        fields.push({
          key,
          instillUIOrder: value.instillUiOrder,
          component: (
            <StartOperatorFreeFormFields.ImageField
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
            />
          ),
        });
        break;
      case "array:image/*":
        fields.push({
          key,
          instillUIOrder: value.instillUiOrder,
          component: (
            <StartOperatorFreeFormFields.ImagesField
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
            />
          ),
        });
        break;
      case "*/*":
        fields.push({
          key,
          instillUIOrder: value.instillUiOrder,
          component: (
            <StartOperatorFreeFormFields.FileField
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
            />
          ),
        });
        break;
      case "array:*/*":
        fields.push({
          key,
          instillUIOrder: value.instillUiOrder,
          component: (
            <StartOperatorFreeFormFields.FilesField
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledFields}
              keyPrefix={keyPrefix}
              disabledFieldControl={disabledFieldControls}
            />
          ),
        });
        break;
      default:
        break;
    }
  }

  return fields
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
