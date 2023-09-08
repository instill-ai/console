import { Nullable } from "@instill-ai/toolkit";
import { getImageTypeFromBase64String } from "pipeline-builder/lib/getImageTypeFromBase64";
import { ConnectorNodeFieldRoot, EndNodeFieldRoot } from "./FieldRoot";

export type ImagesFieldProps = {
  nodeType: "end" | "connector";
  title: Nullable<string>;
  images: Nullable<string>[];
};

export const ImagesField = (props: ImagesFieldProps) => {
  const { nodeType, title, images } = props;

  if (nodeType === "connector") {
    return (
      <ConnectorNodeFieldRoot title={title} key={`${title}-field`}>
        <div className="flex max-w-[246px] flex-wrap">
          {images?.slice(0, 5).map((image) => {
            if (!image) return <></>;

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
      </ConnectorNodeFieldRoot>
    );
  }

  return (
    <EndNodeFieldRoot title={title} key={`${title}-field`}>
      <div className="flex max-w-[246px] flex-wrap">
        {images?.slice(0, 5).map((image) => {
          if (!image) return <></>;

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
    </EndNodeFieldRoot>
  );
};
