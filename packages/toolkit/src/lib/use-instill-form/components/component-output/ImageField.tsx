import { Nullable } from "../../../type";
import { FieldRoot } from "./FieldRoot";

export type ImageFieldProps = {
  title: Nullable<string>;
  image: Nullable<string>;
  hideField?: boolean;
};

export const ImageField = (props: ImageFieldProps) => {
  const { title, image, hideField } = props;

  return (
    <FieldRoot title={title} key={`${title}-field`}>
      {!hideField && image ? (
        <div className="flex w-full">
          <img src={image} alt={`${title}`} className="object-contain" />
        </div>
      ) : null}
    </FieldRoot>
  );
};
