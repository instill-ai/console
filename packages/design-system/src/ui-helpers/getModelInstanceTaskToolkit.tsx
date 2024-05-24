import { ComplicateIcons, Icons } from "../new-ui";

export const getModelInstanceTaskToolkit = (task: string) => {
  switch (task) {
    case "TASK_CLASSIFICATION":
      return {
        getIcon: (className?: string) => {
          return (
            <ComplicateIcons.ImageClassification
              className={className ?? "h-4 w-4"}
              fillAreaColor="fill-semantic-fg-primary"
            />
          );
        },
        label: "Classification",
      };
    case "TASK_DETECTION":
      return {
        getIcon: (className?: string) => {
          return (
            <ComplicateIcons.ObjectDetection
              className={className ?? "h-4 w-4"}
              fillAreaColor="fill-semantic-fg-primary"
            />
          );
        },
        label: "Object Detection",
      };

    case "TASK_KEYPOINT":
      return {
        getIcon: (className?: string) => {
          return (
            <ComplicateIcons.KeypointDetection
              className={className ?? "h-4 w-4"}
              fillAreaColor="fill-semantic-fg-primary"
            />
          );
        },
        label: "Keypoint Detection",
      };

    case "TASK_OCR":
      return {
        getIcon: (className?: string) => {
          return (
            <ComplicateIcons.OpticalCharacterRecognition
              className={className ?? "h-4 w-4"}
              fillAreaColor="fill-semantic-fg-primary"
            />
          );
        },
        label: "Ocr",
      };

    case "TASK_INSTANCE_SEGMENTATION":
      return {
        getIcon: (className?: string) => {
          return (
            <ComplicateIcons.InstanceSegmentation
              className={className ?? "h-4 w-4"}
              fillAreaColor="fill-semantic-fg-primary"
            />
          );
        },
        label: "Instance Segmentation",
      };

    case "TASK_SEMANTIC_SEGMENTATION":
      return {
        getIcon: (className?: string) => {
          return (
            <ComplicateIcons.SemanticSegmentation
              className={className ?? "h-4 w-4"}
              fillAreaColor="fill-semantic-fg-primary"
            />
          );
        },
        label: "Semantic Segmentation",
      };

    case "TASK_TEXT_GENERATION":
      return {
        getIcon: (className?: string) => {
          return (
            <ComplicateIcons.TextGeneration
              className={className ?? "h-4 w-4"}
              fillAreaColor="fill-semantic-fg-primary"
            />
          );
        },
        label: "Text Generation",
      };
    case "TASK_TEXT_EMBEDDINGS":
      return {
        getIcon: (className?: string) => {
          return (
            <ComplicateIcons.TextEmbedding
              className={className ?? "h-4 w-4"}
              fillAreaColor="fill-semantic-fg-secondary"
              pathColor="stroke-semantic-fg-secondary"
            />
          );
        },
        label: "Text Embeddings",
      };

    case "TASK_TEXT_TO_IMAGE":
      return {
        getIcon: (className?: string) => {
          return (
            <ComplicateIcons.TextToImage
              className={className ?? "h-4 w-4"}
              fillAreaColor="fill-semantic-fg-primary"
            />
          );
        },
        label: "Text To Image",
      };

    case "TASK_IMAGE_TO_IMAGE":
      return {
        getIcon: (className?: string) => {
          return (
            <ComplicateIcons.ImageToImage
              className={className ?? "h-4 w-4"}
              pathColor="stroke-semantic-fg-primary"
            />
          );
        },
        label: "Image To Image",
      };

    case "TASK_IMAGE_TO_TEXT":
      return {
        getIcon: (className?: string) => {
          return (
            <ComplicateIcons.ImageToText
              className={className ?? "h-4 w-4"}
              fillAreaColor="fill-semantic-fg-primary"
            />
          );
        },
        label: "Image To Text",
      };
    case "TASK_SPEECH_RECOGNITION":
      return {
        getIcon: (className?: string) => {
          return <Icons.SpeechRecognition className={className ?? "h-4 w-4"} />;
        },
        label: "Speech Recognition",
      };

    case "TASK_VISUAL_QUESTION_ANSWERING":
      return {
        getIcon: (className?: string) => {
          return (
            <Icons.VisualQuestionAnswering className={className ?? "h-4 w-4"} />
          );
        },
        label: "Visual Question Answering",
      };

    case "TASK_TEXT_GENERATION_CHAT":
      return {
        getIcon: (className?: string) => {
          return (
            <Icons.TextGenerationChat className={className ?? "h-4 w-4"} />
          );
        },
        label: "Text Generation Chat",
      };

    default:
      return {
        getIcon: (className?: string) => {
          return <div className={className} />;
        },
        label: "",
      };
  }
};
