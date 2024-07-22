import { Model } from "../lib";
import { env } from "../server";

export const InstillModelVisibility = [
  "VISIBILITY_PRIVATE",
  "VISIBILITY_PUBLIC",
] as const;
export const InstillModelTask = [
  "TASK_CLASSIFICATION",
  "TASK_DETECTION",
  "TASK_KEYPOINT",
  "TASK_OCR",
  "TASK_INSTANCE_SEGMENTATION",
  "TASK_SEMANTIC_SEGMENTATION",
  "TASK_TEXT_GENERATION",
  "TASK_TEXT_GENERATION_CHAT",
  "TASK_TEXT_TO_IMAGE",
  "TASK_IMAGE_TO_IMAGE",
  "TASK_VISUAL_QUESTION_ANSWERING",
] as const;
export const defaultCodeSnippetStyles = {
  fontSize: "14px",
  backgroundColor: "transparent",
  width: "100%",
  padding: "16px",
};

const taskPayloads = {
  TASK_CLASSIFICATION: `"classification": {
        "imageUrl": {your-input-image-url}
      }`,
  TASK_DETECTION: `"detection": {
        "imageUrl": {your-input-image-url}
      }`,
  TASK_KEYPOINT: `"keypoint": {
        "imageUrl": {your-input-image-url}
      }`,
  TASK_OCR: `"ocr": {
        "imageUrl": {your-input-image-url}
      }`,
  TASK_INSTANCE_SEGMENTATION: `"instanceSegmentation": {
        "imageUrl": {your-input-image-url}
      }`,
  TASK_SEMANTIC_SEGMENTATION: `"semanticSegmentation": {
        "imageUrl": {your-input-image-url}
      }`,
  TASK_TEXT_GENERATION: `"textGeneration": {
        "prompt": "In this beautiful day,",
        "systemMessage": "you are a helpful assistant",
        "maxNewTokens": 1024,
        "topK": 5,
        "temperature": 0.7
      }`,
  TASK_TEXT_GENERATION_CHAT: `"textGeneration": {
        "prompt": "How is the weather today?",
        "chatHistory": [
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": "hi"
              }
            ]
          }
        ],
        "systemMessage": "you are a helpful assistant",
        "maxNewTokens": 1024,
        "topK": 5,
        "temperature": 0.7
      }`,
  TASK_TEXT_TO_IMAGE: `"textToImage": {
        "prompt": "award winning high resolution photo of a giant tortoise",
        "steps": 1,
        "cfgScale": 5.5,
        "seed": 1,
        "samples": 1
      }`,
  TASK_IMAGE_TO_IMAGE: `"imageToImage": {
        "prompt": "spacedog",
        "promptImageUrl": "https://artifacts.instill.tech/imgs/dog.jpg",
        "steps": 1,
        "cfgScale": 5.5,
        "seed": 1,
        "samples": 1
      }`,
  TASK_VISUAL_QUESTION_ANSWERING: `"visualQuestionAnswering": {
        "prompt": "what is in the image?",
        "promptImages": [
          {
            "promptImageUrl": "https://artifacts.instill.tech/imgs/dog.jpg"
          }
        ],
        "systemMessage": "you are a helpful assistant",
        "maxNewTokens": 1024,
        "topK": 5,
        "temperature": 0.7
      }`,
};

export const getInstillTaskHttpRequestExample = (model?: Model) => {
  if (!model) {
    return "";
  }

  const apiVersion = env("NEXT_PUBLIC_MODEL_API_VERSION");

  return `curl --location 'https://api.instill.tech/${apiVersion}/${model.name}/trigger' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Bearer $INSTILL_API_TOKEN' \\
--data '{
  "taskInputs": [
    {
      ${taskPayloads[model.task]}
    }
  ]
}'`;
};
