import { Nullable } from "../../../type";
import { ComponentOutputFieldBaseProps } from "../../types";
import { FieldRoot } from "./FieldRoot";

export type ImagesFieldProps = {
  images: Nullable<string>[];
} & ComponentOutputFieldBaseProps;

export const ImagesField = (props: ImagesFieldProps) => {
  const { title, images, hideField } = props;

  return (
    <FieldRoot title={title} fieldKey={`${title}-field`}>
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
