"use client";

import {
  ImageClassificationIcon,
  InstanceSegmentationIcon,
  KeypointDetectionIcon,
  ObjectDetectionIcon,
  OpticalCharacterRecognitionIcon,
  SemanticSegmentationIcon,
} from "@instill-ai/design-system";

import {
  TablePlaceholderBase,
  type TablePlaceholderBaseProps,
} from "../../components";

export type ModelTablePlaceholderProps = Pick<
  TablePlaceholderBaseProps,
  "enableCreateButton" | "marginBottom"
>;

export const ModelTablePlaceholder = (props: ModelTablePlaceholderProps) => {
  const { marginBottom, enableCreateButton } = props;

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
      createButtonTitle="Set up your first model"
      createButtonLink="/models/create"
      marginBottom={marginBottom}
      enableCreateButton={enableCreateButton}
    />
  );
};
