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
        "image_url": {your-input-image-url}
      }`,
  TASK_DETECTION: `"detection": {
        "image_url": {your-input-image-url}
      }`,
  TASK_KEYPOINT: `"keypoint": {
        "image_url": {your-input-image-url}
      }`,
  TASK_OCR: `"ocr": {
        "image_url": {your-input-image-url}
      }`,
  TASK_INSTANCE_SEGMENTATION: `"instance_segmentation": {
        "image_url": {your-input-image-url}
      }`,
  TASK_SEMANTIC_SEGMENTATION: `"semantic_segmentation": {
        "image_url": {your-input-image-url}
      }`,
  TASK_TEXT_GENERATION: `"text_generation": {
        "prompt": "In this beautiful day,",
        "system_message": "you are a helpful assistant",
        "max_new_tokens": 1024,
        "top_k": 5,
        "temperature": 0.7
      }`,
  TASK_TEXT_GENERATION_CHAT: `"text_generation": {
        "prompt": "How is the weather today?",
        "chat_history": [
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
        "system_message": "you are a helpful assistant",
        "max_new_tokens": 1024,
        "top_k": 5,
        "temperature": 0.7
      }`,
  TASK_TEXT_TO_IMAGE: `"text_to_image": {
        "prompt": "award winning high resolution photo of a giant tortoise",
        "steps": 1,
        "cfg_scale": 5.5,
        "seed": 1,
        "samples": 1
      }`,
  TASK_IMAGE_TO_IMAGE: `"image_to_image": {
        "prompt": "spacedog",
        "prompt_image_url": "https://artifacts.instill.tech/imgs/dog.jpg",
        "steps": 1,
        "cfg_scale": 5.5,
        "seed": 1,
        "samples": 1
      }`,
  TASK_VISUAL_QUESTION_ANSWERING: `"visual_question_answering": {
        "prompt": "what is in the image?",
        "prompt_images": [
          {
            "prompt_image_url": "https://artifacts.instill.tech/imgs/dog.jpg"
          }
        ],
        "system_message": "you are a helpful assistant",
        "max_new_tokens": 1024,
        "top_k": 5,
        "temperature": 0.7
      }`,
};

export const getInstillTaskHttpRequestExample = (model?: Model) => {
  if (!model) {
    return "";
  }

  const apiVersion = env("NEXT_PUBLIC_MODEL_API_VERSION");

  return `curl --location 'https://api.instill.tech/model/${apiVersion}/${model.name}/trigger' \\
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
