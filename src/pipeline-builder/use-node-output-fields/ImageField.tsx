import { Nullable } from "@instill-ai/toolkit";

export type ImageFieldProps = {
  title: Nullable<string>;
  image: Nullable<string>;
};

export const ImageField = (props: ImageFieldProps) => {
  const { title, image } = props;

  return (
    <div className="flex flex-col space-y-2">
      <p className="text-semantic-fg-primary product-body-text-3-semibold">
        {title}
      </p>
      {image ? (
        <img src={image} alt={`${title}-image`} className="object-contain" />
      ) : (
        <></>
      )}
    </div>
  );
};
