import { Nullable } from "../../../type";
import { ComponentOutputFieldBaseProps } from "../../types";
import { FieldRoot } from "./FieldRoot";

export type NumberFieldProps = {
  number: Nullable<number>;
} & ComponentOutputFieldBaseProps;

export const NumberField = (props: NumberFieldProps) => {
  const { title, number, hideField } = props;

  return (
    <FieldRoot title={title} fieldKey={`${title}-field`}>
      {number && !hideField ? (
        <div className="flex min-h-[20px] w-full items-center break-all rounded-sm text-semantic-fg-primary product-body-text-4-regular">
          {number}
        </div>
      ) : null}
    </FieldRoot>
  );
};
