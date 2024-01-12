import { Nullable } from "../../../type";
import { ComponentOutputFieldBaseProps } from "../../type";
import { FieldRoot } from "./FieldRoot";

export type NumberFieldProps = {
  number: Nullable<number>;
} & ComponentOutputFieldBaseProps;

export const NumberField = ({
  title,
  number,
  hideField,
  componentID,
  enabledReferenceHint,
  path,
  instillFormat,
}: NumberFieldProps) => {
  return (
    <FieldRoot
      title={title}
      fieldKey={`${title}-field`}
      componentID={componentID}
      enabledReferenceHint={enabledReferenceHint}
      path={path}
      instillFormat={instillFormat}
    >
      {number && !hideField ? (
        <div className="flex min-h-[20px] w-full items-center break-all rounded-sm text-semantic-fg-primary product-body-text-4-regular">
          {number}
        </div>
      ) : null}
    </FieldRoot>
  );
};
