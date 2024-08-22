export const DELETE_CATALOG_TIMEOUT = 15000;
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

export const AskQuestionTabInputSchema = `{
  "type": "object",
  "properties": {
    "question": {
      "type": "string",
      "title": "Question"
    },
    "topK": {
      "type": "integer",
      "format": "int64",
      "title": "Top K"
    }
  },
  "required": ["question"],
  "title": "Ask Question Request"
}`;

export const AskQuestionTabOutputSchema = `{
  "type": "object",
  "properties": {
    "answer": {
      "type": "string",
      "title": "Answer"
    },
    "referenceSources": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "chunkUid": {
            "type": "string",
            "title": "Chunk UID"
          },
          "textContent": {
            "type": "string",
            "title": "Text Content"
          },
          "sourceFile": {
            "type": "string",
            "title": "Source File"
          }
        }
      },
      "title": "Reference Sources"
    }
  },
  "title": "Ask Question Response"
}`;

  export const RetrieveTestTabInputSchema = `{
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

 export  const RetrieveTestTabOutputSchema = `{
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

export const GetCatalogTabInputSchema = `{
  "type": "object",
  "properties": {
    "namespaceId": {
      "type": "string",
      "title": "Namespace ID"
    },
    "catalogId": {
      "type": "string",
      "title": "Catalog ID"
    },
    "fileUid": {
      "type": "string",
      "title": "File UID"
    },
    "fileId": {
      "type": "string",
      "title": "File ID"
    }
  },
  "title": "Get File Catalog Request"
}`;

  export const GetCatalogTabOutputSchema = `{
  "type": "object",
  "properties": {
    "originalData": {
      "type": "string",
      "title": "Original data encoded in base64"
    },
    "metadata": {
      "type": "object",
      "title": "File Catalog Metadata",
      "properties": {
        "fileUid": {
          "type": "string",
          "title": "File UID"
        },
        "fileId": {
          "type": "string",
          "title": "File ID"
        },
        "fileType": {
          "type": "string",
          "title": "File Type"
        },
        "fileSize": {
          "type": "integer",
          "format": "int64",
          "title": "File Size in Bytes"
        },
        "fileUploadTime": {
          "type": "string",
          "format": "date-time",
          "title": "Upload Time"
        },
        "fileProcessStatus": {
          "type": "string",
          "title": "File Process Status"
        }
      }
    },
    "text": {
      "type": "object",
      "title": "Transformed Text Content",
      "properties": {
        "pipelineIds": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Pipelines"
        },
        "transformedContent": {
          "type": "string",
          "title": "Transformed Content"
        },
        "transformedContentUid": {
          "type": "string",
          "title": "Transformed Content UID"
        },
        "transformedContentChunkNum": {
          "type": "integer",
          "format": "int32",
          "title": "Transformed Content Chunk Number"
        },
        "transformedContentTokenNum": {
          "type": "integer",
          "format": "int32",
          "title": "Transformed Content Token Number"
        },
        "transformedContentUpdateTime": {
          "type": "string",
          "format": "date-time",
          "title": "Transformed Content Update Time"
        }
      }
    },
    "chunks": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "uid": {
            "type": "string",
            "title": "Chunk UID"
          },
          "type": {
            "type": "string",
            "title": "Chunk Type"
          },
          "startPos": {
            "type": "integer",
            "format": "int32",
            "title": "Chunk Start Position"
          },
          "endPos": {
            "type": "integer",
            "format": "int32",
            "title": "Chunk End Position"
          },
          "content": {
            "type": "string",
            "title": "Chunk Content"
          },
          "tokensNum": {
            "type": "integer",
            "format": "int32",
            "title": "Chunk Tokens Number"
          },
          "embedding": {
            "type": "array",
            "items": {
              "type": "number",
              "format": "float"
            },
            "title": "Embedding"
          },
          "createTime": {
            "type": "string",
            "format": "date-time",
            "title": "Chunk Create Time"
          },
          "retrievable": {
            "type": "boolean",
            "title": "Chunk Retrievable"
          }
        }
      },
      "title": "Chunks"
    }
  },
  "title": "Get File Catalog Response"
}`;