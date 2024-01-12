import { Nullable } from "../../../type";
import { ComponentOutputFieldBaseProps } from "../../type";
import { FieldRoot } from "./FieldRoot";

export type ImageFieldProps = {
  image: Nullable<string>;
} & ComponentOutputFieldBaseProps;

export const ImageField = ({
  title,
  image,
  hideField,
  componentID,
  enabledReferenceHint,
  path,
  instillFormat,
}: ImageFieldProps) => {
  return (
    <FieldRoot
      title={title}
      fieldKey={`${title}-field`}
      componentID={componentID}
      enabledReferenceHint={enabledReferenceHint}
      path={path}
      instillFormat={instillFormat}
    >
      {!hideField && image ? (
        <div className="flex w-full">
          <img src={image} alt={`${title}`} className="object-contain" />
        </div>
      ) : null}
    </FieldRoot>
  );
};
