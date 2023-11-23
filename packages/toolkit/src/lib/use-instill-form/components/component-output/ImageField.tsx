import { getImageTypeFromBase64String } from "../../../../view/pipeline-builder/lib/getImageTypeFromBase64";
import { Nullable } from "../../../type";
import { ConnectorNodeFieldRoot, EndNodeFieldRoot } from "./FieldRoot";

export type ImageFieldProps = {
  nodeType: "end" | "connector";
  title: Nullable<string>;
  image: Nullable<string>;
  hideField?: boolean;
};

export const ImageField = (props: ImageFieldProps) => {
  const { nodeType, title, image, hideField } = props;

  const imageType = image ? getImageTypeFromBase64String(image) : null;

  if (nodeType === "connector") {
    return (
      <ConnectorNodeFieldRoot title={title} fieldKey={`${title}-field`}>
        {!hideField && image ? (
          <div className="flex w-full">
            <img
              src={`data:image/${imageType};base64,${image}`}
              alt={`${title}`}
              className="object-contain"
            />
          </div>
        ) : null}
      </ConnectorNodeFieldRoot>
    );
  }

  return (
    <EndNodeFieldRoot title={title} key={`${title}-field`}>
      {!hideField && image ? (
        <div className="flex w-full">
          <img
            src={`data:image/${imageType};base64,${image}`}
            alt={`${title}`}
            className="object-contain"
          />
        </div>
      ) : null}
    </EndNodeFieldRoot>
  );
};
