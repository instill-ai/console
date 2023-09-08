import { Nullable } from "@instill-ai/toolkit";
import { ConnectorNodeFieldRoot, EndNodeFieldRoot } from "./FieldRoot";
import { getImageTypeFromBase64String } from "pipeline-builder/lib/getImageTypeFromBase64";

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
        {image ? (
          <img
            src={`data:image/${imageType};base64,${image}`}
            alt={`${title}-image`}
            className="object-contain"
          />
        ) : (
          <></>
        )}
      </ConnectorNodeFieldRoot>
    );
  }

  return (
    <EndNodeFieldRoot title={title} key={`${title}-field`}>
      {image ? (
        <img
          src={`data:image/${imageType};base64,${image}`}
          alt={`${title}-image`}
          className="object-contain"
        />
      ) : (
        <></>
      )}
    </EndNodeFieldRoot>
  );
};
