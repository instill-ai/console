import { Nullable } from "../../../type";
import { ComponentOutputFieldBaseProps } from "../../type";
import { FieldRoot } from "./FieldRoot";

export type ImagesFieldProps = {
  images: Nullable<string>[];
} & ComponentOutputFieldBaseProps;

export const ImagesField = ({
  title,
  images,
  hideField,
  componentID,
  enabledReferenceHint,
  path,
  instillFormat,
}: ImagesFieldProps) => {
  return (
    <FieldRoot
      title={title}
      fieldKey={`${title}-field`}
      componentID={componentID}
      enabledReferenceHint={enabledReferenceHint}
      path={path}
      instillFormat={instillFormat}
    >
      {images && !hideField ? (
        <div className="flex w-full flex-wrap">
          {images?.slice(0, 5)?.map((image) => {
            if (!image) return null;

            return (
              <img
                key={`${title}-${image}-field`}
                alt={`${title}-images-{idx}`}
                src={image}
                className="object-contain"
              />
            );
          })}
        </div>
      ) : null}
    </FieldRoot>
  );
};
