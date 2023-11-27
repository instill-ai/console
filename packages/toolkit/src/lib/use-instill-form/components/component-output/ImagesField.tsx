import { Nullable } from "../../../type";
import { FieldRoot } from "./FieldRoot";

export type ImagesFieldProps = {
  title: Nullable<string>;
  images: Nullable<string>[];
  hideField?: boolean;
};

export const ImagesField = (props: ImagesFieldProps) => {
  const { title, images, hideField } = props;

  return (
    <FieldRoot title={title} key={`${title}-field`}>
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
