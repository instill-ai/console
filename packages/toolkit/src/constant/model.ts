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
  "TASK_TEXT_TO_IMAGE",
  "TASK_EMBEDDING",
  "TASK_SPEECH_RECOGNITION",
  "TASK_CHAT",
  "TASK_COMPLETION",
  "TASK_CUSTOM",
] as const;

export const defaultCodeSnippetStyles = {
  fontSize: "14px",
  backgroundColor: "transparent",
  width: "100%",
  padding: "16px",
};

const imageUrlTask = `{
      "data": {
        "image-url": "https://artifacts.instill.tech/imgs/bear.jpg",
        "type":"image-url"
      }
    }`;

const taskPayloads = {
  TASK_EMBEDDING: `{
      "data": {
        "embeddings": [
          {
            "text": "This is a text content to be embedded",
            "type": "text"
          },
          {
            "text": "This is another text content to be embedded",
            "type": "text"
          },
          {
            "image-url": "https://artifacts.instill.tech/imgs/bear.jpg",
            "type": "image-url"
          },
          {
            "text": "This is the third text content to be embedded",
            "type": "text"
          }
        ]
      }
    }`,
  TASK_SPEECH_RECOGNITION: ``,
  TASK_CUSTOM: `{
      "data": {
        "your-custom-property-name": "your custom property value"
      }
    }`,
  TASK_CLASSIFICATION: imageUrlTask,
  TASK_DETECTION: imageUrlTask,
  TASK_KEYPOINT: imageUrlTask,
  TASK_OCR: imageUrlTask,
  TASK_INSTANCE_SEGMENTATION: imageUrlTask,
  TASK_SEMANTIC_SEGMENTATION: imageUrlTask,
  TASK_COMPLETION: `{
      "data": {
        prompt": "In this beautiful day, I",
      },
      "parameter": {
        "max-tokens": 256,
        "n": 1,
        "seed": 0,
        "stream": false,
        "temperature": 0.7,
        "top-p": 1
      }
    }`,
  TASK_CHAT: `{
      "data": {
        "messages": [
          {
            "content": [
              {
                "text": "what is basketball?",
                "type": "text"
              }
            ],
            "role": "user"
          }
        ]
      },
      "parameter": {
        "max-tokens": 256,
        "n": 1,
        "seed": 0,
        "stream": false,
        "temperature": 0.7,
        "top-p": 1
      }
    }`,
  TASK_TEXT_TO_IMAGE: `{
      "data": {
        "prompt": "A cute cat napping",
      },
      "parameter": {
        "n": 1,
        "seed": 0
      }
    }`,
};

export const getInstillTaskHttpRequestExample = (model?: Model) => {
  if (!model) {
    return "";
  }

  const apiVersion = env("NEXT_PUBLIC_MODEL_API_VERSION");

  return `curl --location 'https://api.instill.tech/${apiVersion}/${model.name}/trigger' \\
--header "Content-Type: application/json" \\
--header "Authorization: Bearer $INSTILL_API_TOKEN" \\
--data '{
  "taskInputs": [
    ${taskPayloads[model.task]}
  ]
}'`;
};
