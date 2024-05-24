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

export const getInstillTaskHttpRequestExample = (model?: Model) => {
  if (!model) {
    return "";
  }

  const apiVersion = env("NEXT_PUBLIC_MODEL_API_VERSION");

  switch (model.task) {
    case "TASK_CLASSIFICATION":
      return `curl --location 'https://api.instill.tech/model/${apiVersion}/${model.name}/trigger' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Bearer {your-api-key}' \\
--data '{
  "task_inputs": [
    {
      "classification": {
        "image_url": {your-input-image-url}
      }
    }
  ]
}'`;
    case "TASK_DETECTION":
      return `curl --location 'https://api.instill.tech/model/${apiVersion}/${model.name}/trigger' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Bearer {your-api-key}' \\
--data '{
  "task_inputs": [
    {
      "detection": {
        "image_url": {your-input-image-url}
      }
    }
  ]
}'`;
    case "TASK_KEYPOINT":
      return `curl --location 'https://api.instill.tech/model/${apiVersion}/${model.name}/trigger' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Bearer {your-api-key}' \\
--data '{
  "task_inputs": [
    {
      "keypoint": {
        "image_url": {your-input-image-url}
      }
    }
  ]
}'`;
    case "TASK_OCR":
      return `curl --location 'https://api.instill.tech/model/${apiVersion}/${model.name}/trigger' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Bearer {your-api-key}' \\
--data '{
  "task_inputs": [
    {
      "ocr": {
        "image_url": {your-input-image-url}
      }
    }
  ]
}'`;
    case "TASK_INSTANCE_SEGMENTATION":
      return `curl --location 'https://api.instill.tech/model/${apiVersion}/${model.name}/trigger' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Bearer {your-api-key}' \\
--data '{
  "task_inputs": [
    {
      "instance_segmentation": {
        "image_url": {your-input-image-url}
      }
    }
  ]
}'`;
    case "TASK_SEMANTIC_SEGMENTATION":
      return `curl --location 'https://api.instill.tech/model/${apiVersion}/${model.name}/trigger' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Bearer {your-api-key}' \\
--data '{
  "task_inputs": [
    {
      "semantic_segmentation": {
        "image_url": {your-input-image-url}
      }
    }
  ]
}'`;
    case "TASK_TEXT_GENERATION":
      return `curl --location 'https://api.instill.tech/model/${apiVersion}/${model.name}/trigger' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Bearer {your-api-key}' \\
--data '{
  "task_inputs": [
    {
      "text_generation": {
        "prompt": "In this beautiful day,",
        "system_message": "you are a helpful assistant",
        "max_new_tokens": 1024,
        "top_k": 5,
        "temperature": 0.7
      }
    }
  ]
}'`;
    case "TASK_TEXT_GENERATION_CHAT":
      return `curl --location 'https://api.instill.tech/model/${apiVersion}/${model.name}/trigger' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Bearer {your-api-key}' \\
--data '{
  "task_inputs": [
    {
      "text_generation": {
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
      }
    }
  ]
}'`;
    case "TASK_TEXT_TO_IMAGE":
      return `curl --location 'https://api.instill.tech/model/${apiVersion}/${model.name}/trigger' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Bearer {your-api-key}' \\
--data '{
  "task_inputs": [
    {
      "text_to_image": {
        "prompt": "award winning high resolution photo of a giant tortoise",
        "steps": 1,
        "cfg_scale": 5.5,
        "seed": 1,
        "samples": 1
      }
    }
  ]
}'`;
    case "TASK_IMAGE_TO_IMAGE":
      return `curl --location 'https://api.instill.tech/model/${apiVersion}/${model.name}/trigger' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Bearer {your-api-key}' \\
--data '{
  "task_inputs": [
    {
      "image_to_image": {
        "prompt": "spacedog",
        "prompt_image_url": "https://artifacts.instill.tech/imgs/dog.jpg",
        "steps": 1,
        "cfg_scale": 5.5,
        "seed": 1,
        "samples": 1
      }
    }
  ]
}'`;
    case "TASK_VISUAL_QUESTION_ANSWERING":
      return `curl --location 'https://api.instill.tech/model/${apiVersion}/${model.name}/trigger' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Bearer {your-api-key}' \\
--data '{
  "task_inputs": [
    {
      "visual_question_answering": {
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
      }
    }
  ]
}'`;
  }
};
