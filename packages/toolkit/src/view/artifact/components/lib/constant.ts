export const DELETE_KNOWLEDGE_BASE_TIMEOUT = 15000;
export const DELETE_FILE_TIMEOUT = 5000;
export const FILE_ERROR_TIMEOUT = 5000;
export const CREDIT_TIMEOUT = 5000;
export const MAX_FILE_NAME_LENGTH = 128;
export const MAX_FILE_SIZE = 15 * 1024 * 1024;
export const MAX_FILE_SIZE_FREE = 15 * 1024 * 1024; // 15MB
export const MAX_FILE_SIZE_PAID = 150 * 1024 * 1024; // 150MB
export const STORAGE_LIMIT_FREE = 50 * 1024 * 1024; // 50MB
export const STORAGE_LIMIT_PRO = 500 * 1024 * 1024; // 500MB
export const STORAGE_LIMIT_TEAM = 2 * 1024 * 1024 * 1024; // 2GB
export const MAX_DESCRIPTION_LENGTH = 150;
export const STORAGE_WARNING_THRESHOLD = 5; // 5%

export const SearchChunksTabInputSchema = `{
  "type": "object",
  "properties": {
    "textPrompt": {
      "type": "string",
      "title": "text prompt"
    },
    "topK": {
      "type": "integer",
      "format": "int64",
      "title": "topK"
    }
  },
  "title": "Similar chunk search request"
}`;

export const SearchChunksTabOutputSchema = `{
  "type": "object",
  "properties": {
    "similarChunks": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "chunkUid": {
            "type": "string",
            "title": "chunk uid"
          },
          "similarityScore": {
            "type": "number",
            "format": "float",
            "title": "similarity score"
          },
          "textContent": {
            "type": "string",
            "title": "chunk"
          },
          "sourceFile": {
            "type": "string",
            "title": "source file"
          }
        },
        "title": "similarity chunks"
      },
      "title": "chunks"
    }
  },
  "title": "Similar chunk search response"
}`;
