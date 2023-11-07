import { getImageTypeFromBase64String } from "../../../../view/pipeline-builder/lib/getImageTypeFromBase64";
import { Nullable } from "../../../type";
import { ConnectorNodeFieldRoot, EndNodeFieldRoot } from "./FieldRoot";

export type ImageFieldProps = {
  nodeType: "end" | "connector";
  title: Nullable<string>;
  image: Nullable<string>;
};

export const ImageField = (props: ImageFieldProps) => {
  const { nodeType, title, image } = props;

  const imageType = image ? getImageTypeFromBase64String(image) : null;

  if (nodeType === "connector") {
    return (
      <ConnectorNodeFieldRoot title={title} key={`${title}-field`}>
        <div className="flex w-full">
          {image ? (
            <img
              src={`data:image/${imageType};base64,${image}`}
              alt={`${title}`}
              className="object-contain"
            />
          ) : (
            <></>
          )}
        </div>
      </ConnectorNodeFieldRoot>
    );
  }

  return (
    <EndNodeFieldRoot title={title} key={`${title}-field`}>
      <div className="flex w-full">
        {image ? (
          <img
            src={`data:image/${imageType};base64,${image}`}
            alt={`${title}`}
            className="object-contain"
          />
        ) : (
          <></>
        )}
      </div>
    </EndNodeFieldRoot>
  );
};
