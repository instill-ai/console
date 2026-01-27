import { getQueryString } from "../helper";
import { APIResource } from "../main/resource";
import {
  DownloadNamespaceObjectRequest,
  GetNamespaceObjectDownloadURLRequest,
  GetNamespaceObjectDownloadURLResponse,
  GetNamespaceObjectUploadURLRequest,
  GetObjectUploadURLResponse,
  UploadNamespaceObjectRequest,
  CreateFileRequest,
  CreateFileResponse,
  CreateKnowledgeBaseRequest,
  CreateKnowledgeBaseResponse,
  DeleteFileRequest,
  DeleteKnowledgeBaseRequest,
  DeleteObjectRequest,
  GetChunkRequest,
  GetChunkResponse,
  GetFileRequest,
  GetFileResponse,
  GetKnowledgeBaseRequest,
  GetKnowledgeBaseResponse,
  GetObjectRequest,
  GetObjectResponse,
  ListChunksRequest,
  ListChunksResponse,
  ListFilesRequest,
  ListFilesResponse,
  ListKnowledgeBasesRequest,
  ListKnowledgeBasesResponse,
  ReprocessFileRequest,
  ReprocessFileResponse,
  SearchChunksRequest,
  SearchChunksResponse,
  UpdateChunkRequest,
  UpdateChunkResponse,
  UpdateFileRequest,
  UpdateFileResponse,
  UpdateKnowledgeBaseRequest,
  UpdateKnowledgeBaseResponse,
  UpdateObjectRequest,
  UpdateObjectResponse,
} from "./types";

export class ArtifactClient extends APIResource {
  async getNamespaceObjectUploadURL({
    parent,
    displayName,
    urlExpireDays,
    lastModifiedTime,
    objectExpireDays,
  }: GetNamespaceObjectUploadURLRequest) {
    // Validate parent before constructing URL
    if (!parent || parent.includes("undefined") || parent.includes("null")) {
      console.error(
        "[ArtifactClient] BLOCKED: Invalid parent in getNamespaceObjectUploadURL",
        { parent, displayName },
      );
      return Promise.reject(new Error(`Invalid parent: ${parent}`));
    }

    const queryString = getQueryString({
      baseURL: `/${parent}/object-upload-url`,
      displayName,
      urlExpireDays,
      lastModifiedTime,
      objectExpireDays,
    });

    try {
      const data =
        await this._client.get<GetObjectUploadURLResponse>(queryString);

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async uploadNamespaceObject({
    uploadUrl,
    object,
    contentType,
  }: UploadNamespaceObjectRequest) {
    try {
      await this._client.put(uploadUrl, {
        body: object,
        isFullPath: true,
        isVoidReturn: true,
        additionalHeaders: {
          "Content-Type": contentType,
        },
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getNamespaceObjectDownloadURL({
    name,
    urlExpireDays,
    downloadFilename,
  }: GetNamespaceObjectDownloadURLRequest) {
    // name is the full resource name: `namespaces/{namespace}/objects/{object}`
    const queryString = getQueryString({
      baseURL: `/${name}/download-url`,
      urlExpireDays,
      downloadFilename,
    });

    try {
      const data =
        await this._client.get<GetNamespaceObjectDownloadURLResponse>(
          queryString,
        );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async downloadNamespaceObject({
    downloadUrl,
  }: DownloadNamespaceObjectRequest) {
    try {
      const data = await this._client.get<Response>(downloadUrl, {
        isFullPath: true,
        isBlob: true,
      });

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /* ----------------------------------------------------------------------------
   * Knowledge Base Methods
   * ---------------------------------------------------------------------------*/

  async listKnowledgeBases({ namespaceId }: ListKnowledgeBasesRequest) {
    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/knowledge-bases`,
      });

      const data =
        await this._client.get<ListKnowledgeBasesResponse>(queryString);

      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getKnowledgeBase({
    namespaceId,
    knowledgeBaseId,
  }: GetKnowledgeBaseRequest) {
    try {
      const data = await this._client.get<GetKnowledgeBaseResponse>(
        `/namespaces/${namespaceId}/knowledge-bases/${knowledgeBaseId}`,
      );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async createKnowledgeBase(props: CreateKnowledgeBaseRequest) {
    const { namespaceId, ...payload } = props;

    try {
      const data = await this._client.post<CreateKnowledgeBaseResponse>(
        `/namespaces/${namespaceId}/knowledge-bases`,
        {
          body: JSON.stringify(payload),
        },
      );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateKnowledgeBase(props: UpdateKnowledgeBaseRequest) {
    const { namespaceId, knowledgeBaseId, ...payload } = props;

    try {
      const data = await this._client.patch<UpdateKnowledgeBaseResponse>(
        `/namespaces/${namespaceId}/knowledge-bases/${knowledgeBaseId}`,
        {
          body: JSON.stringify(payload),
        },
      );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteKnowledgeBase({
    namespaceId,
    knowledgeBaseId,
  }: DeleteKnowledgeBaseRequest) {
    try {
      await this._client.delete(
        `/namespaces/${namespaceId}/knowledge-bases/${knowledgeBaseId}`,
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /* ----------------------------------------------------------------------------
   * Files
   * ---------------------------------------------------------------------------*/

  async createFile(props: CreateFileRequest) {
    const { namespaceId, knowledgeBaseId, file } = props;

    try {
      // KB is now in the path: POST /v1alpha/{parent=namespaces/*/knowledgeBases/*}/files
      const data = await this._client.post<CreateFileResponse>(
        `/namespaces/${namespaceId}/knowledge-bases/${knowledgeBaseId}/files`,
        {
          body: JSON.stringify(file),
        },
      );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getFile(props: GetFileRequest) {
    const { namespaceId, knowledgeBaseId, fileId, view } = props;

    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/knowledge-bases/${knowledgeBaseId}/files/${fileId}`,
      ...(view && { view }),
    });

    try {
      const data = await this._client.get<GetFileResponse>(queryString);

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listFiles(props: ListFilesRequest) {
    const { namespaceId, knowledgeBaseId, pageSize, pageToken, filter } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/knowledge-bases/${knowledgeBaseId}/files`,
        pageSize,
        pageToken,
        filter,
      });

      const data = await this._client.get<ListFilesResponse>(queryString);

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateFile(props: UpdateFileRequest) {
    const { namespaceId, knowledgeBaseId, fileId, ...payload } = props;

    try {
      const data = await this._client.patch<UpdateFileResponse>(
        `/namespaces/${namespaceId}/knowledge-bases/${knowledgeBaseId}/files/${fileId}`,
        {
          body: JSON.stringify(payload),
        },
      );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async reprocessFile({
    namespaceId,
    knowledgeBaseId,
    fileId,
  }: ReprocessFileRequest) {
    try {
      const data = await this._client.post<ReprocessFileResponse>(
        `/namespaces/${namespaceId}/knowledge-bases/${knowledgeBaseId}/files/${fileId}/reprocess`,
      );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteFile({
    namespaceId,
    knowledgeBaseId,
    fileId,
  }: DeleteFileRequest) {
    try {
      await this._client.delete(
        `/namespaces/${namespaceId}/knowledge-bases/${knowledgeBaseId}/files/${fileId}`,
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /* ----------------------------------------------------------------------------
   * Chunks
   * ---------------------------------------------------------------------------*/

  async getChunk(props: GetChunkRequest) {
    const { namespaceId, knowledgeBaseId, fileId, chunkId, chunkType } = props;

    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/knowledge-bases/${knowledgeBaseId}/files/${fileId}/chunks/${chunkId}`,
      ...(chunkType && { chunkType }),
    });

    try {
      const data = await this._client.get<GetChunkResponse>(queryString);

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listChunks(props: ListChunksRequest) {
    const { namespaceId, knowledgeBaseId, fileId, pageSize, pageToken } = props;

    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/knowledge-bases/${knowledgeBaseId}/files/${fileId}/chunks`,
      pageSize,
      pageToken,
    });

    try {
      const data = await this._client.get<ListChunksResponse>(queryString);

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateChunk(props: UpdateChunkRequest) {
    const { namespaceId, knowledgeBaseId, fileId, chunkId, ...payload } = props;

    try {
      const data = await this._client.patch<UpdateChunkResponse>(
        `/namespaces/${namespaceId}/knowledge-bases/${knowledgeBaseId}/files/${fileId}/chunks/${chunkId}`,
        {
          body: JSON.stringify(payload),
        },
      );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async searchChunks(props: SearchChunksRequest) {
    const { namespaceId, knowledgeBaseId, fileIds, ...restPayload } = props;

    // Build the payload with resource names
    const payload: Record<string, unknown> = {
      ...restPayload,
    };

    // Add knowledge_base resource name if provided
    if (knowledgeBaseId) {
      payload.knowledgeBase = `namespaces/${namespaceId}/knowledgeBases/${knowledgeBaseId}`;
    }

    // Add files resource names if provided
    if (fileIds && fileIds.length > 0 && knowledgeBaseId) {
      payload.files = fileIds.map(
        (fileId) =>
          `namespaces/${namespaceId}/knowledgeBases/${knowledgeBaseId}/files/${fileId}`,
      );
    }

    try {
      const data = await this._client.post<SearchChunksResponse>(
        `/namespaces/${namespaceId}/search-chunks`,
        {
          body: JSON.stringify(payload),
        },
      );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /* ----------------------------------------------------------------------------
   * Objects
   * ---------------------------------------------------------------------------*/

  async getObject({ namespaceId, objectId }: GetObjectRequest) {
    try {
      const data = await this._client.get<GetObjectResponse>(
        `/namespaces/${namespaceId}/objects/${objectId}`,
      );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateObject(props: UpdateObjectRequest) {
    const { namespaceId, objectId, ...payload } = props;

    try {
      const data = await this._client.patch<UpdateObjectResponse>(
        `/namespaces/${namespaceId}/objects/${objectId}`,
        {
          body: JSON.stringify(payload),
        },
      );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteObject({ namespaceId, objectId }: DeleteObjectRequest) {
    try {
      await this._client.delete(
        `/namespaces/${namespaceId}/objects/${objectId}`,
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
