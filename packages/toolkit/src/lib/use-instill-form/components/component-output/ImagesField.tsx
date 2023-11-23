import { getImageTypeFromBase64String } from "../../../../view/pipeline-builder/lib/getImageTypeFromBase64";
import { Nullable } from "../../../type";
import { ConnectorNodeFieldRoot, EndNodeFieldRoot } from "./FieldRoot";

export type ImagesFieldProps = {
  nodeType: "end" | "connector";
  title: Nullable<string>;
  images: Nullable<string>[];
  hideField?: boolean;
};

export const ImagesField = (props: ImagesFieldProps) => {
  const { nodeType, title, images, hideField } = props;

  if (nodeType === "connector") {
    return (
      <ConnectorNodeFieldRoot title={title} fieldKey={`${title}-field`}>
        {images && !hideField ? (
          <div className="flex w-full flex-wrap">
            {images?.slice(0, 5).map((image) => {
              if (!image) return null;

              const imageType = getImageTypeFromBase64String(image);

              return (
                <img
                  key={`${title}-${image}-field`}
                  alt={`${title}-images-{idx}`}
                  src={`data:image/${imageType};base64,${image}`}
                  className="object-contain"
                />
              );
            })}
          </div>
        ) : null}
      </ConnectorNodeFieldRoot>
    );
  }

  return (
    <EndNodeFieldRoot title={title} key={`${title}-field`}>
      {images && !hideField ? (
        <div className="flex w-full flex-wrap">
          {images?.slice(0, 5).map((image) => {
            if (!image) return null;

            const imageType = getImageTypeFromBase64String(image);

            return (
              <img
                key={`${title}-${image}-field`}
                alt={`${title}-images-{idx}`}
                src={`data:image/${imageType};base64,${image}`}
                className="object-contain"
              />
            );
          })}
        </div>
      ) : null}
    </EndNodeFieldRoot>
  );
};
