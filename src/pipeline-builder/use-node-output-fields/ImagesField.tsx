import { Nullable } from "@instill-ai/toolkit";

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
      <div className="grid grid-flow-row grid-cols-3 grid-rows-2">
        {images
          .slice(0, 5)
          .map((image, idx) =>
            image ? (
              <img
                alt={`${title}-images-{idx}`}
                src={image}
                className="object-contain"
              />
            ) : (
              <></>
            )
          )}
      </div>
    </div>
  );
};
