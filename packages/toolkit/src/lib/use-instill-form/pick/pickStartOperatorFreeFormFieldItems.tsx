import { UseFormReturn } from "react-hook-form";
import { Nullable } from "../../type";
import { StartOperatorMetadata } from "../../vdp-sdk";
import { StartOperatorFreeFormFields } from "../components";
import { StartOperatorFreeFormFieldItem } from "../type";

export function pickStartOperatorFreeFormFieldItems(
  metadata: Nullable<StartOperatorMetadata>,
  form: UseFormReturn<{ [k: string]: any }, any, undefined>,
  onEditField: (key: string) => void,
  onDeleteField: (key: string) => void
) {
  const fields: StartOperatorFreeFormFieldItem[] = [];

  if (!metadata) return fields;

  // This component will only be displayed under test mode, and under test
  // /view-only mode, we will display user defined title as title.

  for (const [key, value] of Object.entries(metadata)) {
    switch (value.instillFormat) {
      case "string":
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
            />
          ),
        });
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
            />
          ),
        });
        break;
      default:
        break;
    }
  }

  return fields.sort((a, b) => {
    if (typeof a.instillUIOrder === "undefined") {
      return 1;
    }

    if (typeof b.instillUIOrder === "undefined") {
      return -1;
    }

    return a.instillUIOrder > b.instillUIOrder ? 1 : -1;
  });
}
