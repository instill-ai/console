import { getInstillAdditionalHeaders, getQueryString } from "../helper";
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
  GetChunkRequest,
  GetChunkResponse,
  GetFileRequest,
  GetFileResponse,
  ListChunksRequest,
  ListChunksResponse,
  ListFilesRequest,
  ListFilesResponse,
  ListKnowledgeBaseRunsRequest,
  ListKnowledgeBaseRunsResponse,
  ListKnowledgeBasesRequest,
  ListKnowledgeBasesResponse,
  SearchChunksRequest,
  SearchChunksResponse,
  UpdateChunkRequest,
  UpdateChunkResponse,
  UpdateFileRequest,
  UpdateFileResponse,
  UpdateKnowledgeBaseRequest,
  UpdateKnowledgeBaseResponse,
} from "./types";

export class ArtifactClient extends APIResource {
  async getNamespaceObjectUploadURL({
    namespaceId,
    objectName,
    urlExpireDays,
    lastModifiedTime,
    objectExpireDays,
  }: GetNamespaceObjectUploadURLRequest) {
    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/object-upload-url`,
      objectName,
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
    namespaceId,
    objectUid,
    urlExpireDays,
  }: GetNamespaceObjectDownloadURLRequest) {
    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/object-download-url`,
      objectUid,
      urlExpireDays,
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

  async createKnowledgeBase(props: CreateKnowledgeBaseRequest) {
    const { namespaceId, ...payload } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/knowledge-bases`,
      });

      const data = await this._client.post<CreateKnowledgeBaseResponse>(
        queryString,
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
      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/knowledge-bases/${knowledgeBaseId}`,
      });

      const data = await this._client.put<UpdateKnowledgeBaseResponse>(
        queryString,
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
      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/knowledge-bases/${knowledgeBaseId}`,
      });

      await this._client.delete(queryString);
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
      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/knowledge-bases/${knowledgeBaseId}/files`,
      });

      // The gRPC gateway expects the File object directly in the body (body: "file" in proto)
      const data = await this._client.post<CreateFileResponse>(queryString, {
        body: JSON.stringify(file),
      });

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
    const { namespaceId, knowledgeBaseId, pageSize, pageToken } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/knowledge-bases/${knowledgeBaseId}/files`,
        pageSize,
        pageToken,
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
      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/knowledge-bases/${knowledgeBaseId}/files/${fileId}`,
      });

      const data = await this._client.patch<UpdateFileResponse>(queryString, {
        body: JSON.stringify(payload),
      });

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
      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/knowledge-bases/${knowledgeBaseId}/files/${fileId}`,
      });

      await this._client.delete(queryString);
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
    const { namespaceId, knowledgeBaseId, chunkId, ...payload } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/knowledge-bases/${knowledgeBaseId}/chunks/${chunkId}`,
      });

      const data = await this._client.patch<UpdateChunkResponse>(queryString, {
        body: JSON.stringify(payload),
      });

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async searchChunks(props: SearchChunksRequest) {
    const { namespaceId, knowledgeBaseId, requesterUid, ...payload } = props;

    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/knowledge-bases/${knowledgeBaseId}/searchChunks`,
    });

    const additionalHeaders = getInstillAdditionalHeaders({
      requesterUid: requesterUid,
    });

    try {
      const data = await this._client.post<SearchChunksResponse>(queryString, {
        body: JSON.stringify(payload),
        additionalHeaders,
      });

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /* ----------------------------------------------------------------------------
   * Knowledge Base Runs
   * ---------------------------------------------------------------------------*/

  async listKnowledgeBaseRuns(props: ListKnowledgeBaseRunsRequest) {
    const { namespaceId, knowledgeBaseId, pageSize, page, filter, orderBy } =
      props;

    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/knowledge-bases/${knowledgeBaseId}/runs`,
      page,
      pageSize,
      filter,
      orderBy,
    });

    try {
      const data =
        await this._client.get<ListKnowledgeBaseRunsResponse>(queryString);

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
