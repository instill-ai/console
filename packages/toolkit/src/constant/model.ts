import { ModelTask } from "../lib";

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
export const InstillTaksHttpRequestExample: Record<ModelTask, string> = {
  TASK_CLASSIFICATION: `curl --location 'https://api.instill.tech/model/v1alpha/users/{user_id}/models/{model_id}/versions/{version_id}/trigger' \\
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
}'`,
  TASK_DETECTION: `curl --location 'https://api.instill.tech/model/v1alpha/users/{user_id}/models/{model_id}/versions/{version_id}/trigger' \\
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
}'`,
  TASK_KEYPOINT: `curl --location 'https://api.instill.tech/model/v1alpha/users/{user_id}/models/{model_id}/versions/{version_id}/trigger' \\
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
}'`,
  TASK_OCR: `curl --location 'https://api.instill.tech/model/v1alpha/users/{user_id}/models/{model_id}/versions/{version_id}/trigger' \\
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
}'`,
  TASK_INSTANCE_SEGMENTATION: `curl --location 'https://api.instill.tech/model/v1alpha/users/{user_id}/models/{model_id}/versions/{version_id}/trigger' \\
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
}'`,
  TASK_SEMANTIC_SEGMENTATION: `curl --location 'https://api.instill.tech/model/v1alpha/users/{user_id}/models/{model_id}/versions/{version_id}/trigger' \\
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
}'`,
  TASK_TEXT_GENERATION: `curl --location 'https://api.instill.tech/model/v1alpha/users/{user_id}/models/{model_id}/versions/{version_id}/trigger' \\
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
}'`,
  TASK_TEXT_GENERATION_CHAT: `curl --location 'https://api.instill.tech/model/v1alpha/users/{user_id}/models/{model_id}/versions/{version_id}/trigger' \\
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
}'`,
  TASK_TEXT_TO_IMAGE: `curl --location 'https://api.instill.tech/model/v1alpha/users/{user_id}/models/{model_id}/versions/{version_id}/trigger' \\
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
}'`,
  TASK_IMAGE_TO_IMAGE: `curl --location 'https://api.instill.tech/model/v1alpha/users/{user_id}/models/{model_id}/versions/{version_id}/trigger' \\
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
}'`,
  TASK_VISUAL_QUESTION_ANSWERING: `curl --location 'https://api.instill.tech/model/v1alpha/users/{user_id}/models/{model_id}/versions/{version_id}/trigger' \\
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
}'`,
};
