import { Nullable } from "../../../type";
import { ComponentOutputFieldBaseProps } from "../../type";
import { FieldRoot } from "./FieldRoot";

export type NumbersFieldProps = {
  numbers: Nullable<number>[];
} & ComponentOutputFieldBaseProps;

export const NumbersField = ({
  title,
  numbers,
  hideField,
  componentID,
  enabledReferenceHint,
  path,
  instillFormat,
}: NumbersFieldProps) => {
  return (
    <FieldRoot
      title={title}
      fieldKey={`${title}-field`}
      componentID={componentID}
      enabledReferenceHint={enabledReferenceHint}
      path={path}
      instillFormat={instillFormat}
    >
      {numbers && !hideField ? (
        <div className="flex w-full flex-row flex-wrap gap-2">
          {numbers.map((number) => (
            <div
              key={`${title}-${number}-field`}
              className="min-h-[20px] w-full items-center break-all rounded-sm text-semantic-fg-primary product-body-text-4-regular"
            >
              {number}
            </div>
          ))}
        </div>
      ) : null}
    </FieldRoot>
  );
};
