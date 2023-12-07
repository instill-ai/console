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
  disabledAll,
  keyPrefix,
}: {
  metadata: Nullable<StartOperatorMetadata>;
  form: UseFormReturn<{ [k: string]: any }, any, undefined>;
  onEditField: (key: string) => void;
  onDeleteField: (key: string) => void;
  disabledAll?: boolean;
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
                key={key}
                form={form}
                path={key}
                title={value.title}
                onDeleteField={onDeleteField}
                onEditField={onEditField}
                description={value.description ?? null}
                disabled={disabledAll}
                keyPrefix={keyPrefix}
              />
            ),
          });
        } else {
          fields.push({
            key,
            instillUIOrder: value.instillUiOrder,
            component: (
              <StartOperatorFreeFormFields.TextField
                key={key}
                form={form}
                path={key}
                title={value.title}
                onDeleteField={onDeleteField}
                onEditField={onEditField}
                description={value.description ?? null}
                disabled={disabledAll}
                keyPrefix={keyPrefix}
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
              key={key}
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledAll}
              keyPrefix={keyPrefix}
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
              key={key}
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledAll}
              keyPrefix={keyPrefix}
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
              key={key}
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledAll}
              keyPrefix={keyPrefix}
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
              key={key}
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledAll}
              keyPrefix={keyPrefix}
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
              key={key}
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledAll}
              keyPrefix={keyPrefix}
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
              key={key}
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledAll}
              keyPrefix={keyPrefix}
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
              key={key}
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledAll}
              keyPrefix={keyPrefix}
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
              key={key}
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledAll}
              keyPrefix={keyPrefix}
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
              key={key}
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledAll}
              keyPrefix={keyPrefix}
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
              key={key}
              form={form}
              path={key}
              title={value.title}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              description={value.description ?? null}
              disabled={disabledAll}
              keyPrefix={keyPrefix}
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
