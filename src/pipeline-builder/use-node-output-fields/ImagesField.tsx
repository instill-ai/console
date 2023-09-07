import { Nullable } from "@instill-ai/toolkit";
import { getImageTypeFromBase64String } from "pipeline-builder/lib/getImageTypeFromBase64";

export type ImagesFieldProps = {
  title: Nullable<string>;
  images: Nullable<string>[];
};

export const ImagesField = (props: ImagesFieldProps) => {
  const { title, images } = props;

  return (
    <div className="flex flex-col space-y-2">
      <p className="text-semantic-fg-primary product-body-text-3-semibold">
        {title}
      </p>
      <div className="flex max-w-[246px] flex-wrap">
        {images?.slice(0, 5).map((image) => {
          if (!image) return <></>;

          const imageType = getImageTypeFromBase64String(image);

          return (
            <img
              key={image}
              alt={`${title}-images-{idx}`}
              src={`data:image/${imageType};base64,${image}`}
              className="object-contain"
            />
          );
        })}
      </div>
    </div>
  );
};
