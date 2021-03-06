import {
  ImageClassificationIcon,
  InstanceSegmentationIcon,
  KeypointDetectionIcon,
  ObjectDetectionIcon,
  OpticalCharacterRecognitionIcon,
  SemanticSegmentationIcon,
} from "@instill-ai/design-system";
import { FC } from "react";
import TablePlaceholderBase, {
  TablePlaceholderBaseProps,
} from "../TablePlaceholderBase";

export type ModelTablePlaceholderProps = {
  marginBottom: TablePlaceholderBaseProps["marginBottom"];
  enablePlaceholderCreateButton: TablePlaceholderBaseProps["enableCreateButton"];
};

const ModelTablePlaceholder: FC<ModelTablePlaceholderProps> = ({
  marginBottom,
  enablePlaceholderCreateButton,
}) => {
  const width = "w-[136px]";
  const height = "h-[136px]";

  const placeholderItems = [
    {
      id: "model-image-classification",
      item: (
        <ImageClassificationIcon
          position="m-auto"
          width={width}
          height={height}
        />
      ),
    },
    {
      id: "model-object-detection",
      item: (
        <ObjectDetectionIcon position="m-auto" width={width} height={height} />
      ),
    },
    {
      id: "model-keypoint-detection",
      item: (
        <KeypointDetectionIcon
          position="m-auto"
          width={width}
          height={height}
        />
      ),
    },
    {
      id: "model-instance-segmentation",
      item: (
        <InstanceSegmentationIcon
          position="m-auto"
          width={width}
          height={height}
        />
      ),
    },
    {
      id: "model-semantic-segmentation",
      item: (
        <SemanticSegmentationIcon
          position="m-auto"
          width={width}
          height={height}
        />
      ),
    },
    {
      id: "model-optical-character-recognition",
      item: (
        <OpticalCharacterRecognitionIcon
          position="m-auto"
          width={width}
          height={height}
        />
      ),
    },
  ];

  return (
    <TablePlaceholderBase
      placeholderItems={placeholderItems}
      placeholderTitle="No model"
      createButtonTitle="Upload your first model"
      createButtonLink="/models/create"
      marginBottom={marginBottom}
      enableCreateButton={enablePlaceholderCreateButton}
    />
  );
};

export default ModelTablePlaceholder;
