import { getQueryString } from "../../helper";
import { APIResource } from "../../main/resource";
import { Chunk, CreateKnowledgeBaseRequest, DeleteKnowledgeBaseFileRequest, DeleteKnowledgeBaseRequest, GetChunkContentRequest, GetFileContentRequest, GetFileDetailsRequest, GetKnowledgeBaseRequest, GetSourceFileRequest, KnowledgeBase, ListChunksRequest, ListChunksResponse, ListKnowledgeBaseFilesRequest, ListKnowledgeBaseFilesResponse, ListKnowledgeBasesRequest, ListKnowledgeBasesResponse, ProcessKnowledgeBaseFilesRequest, SimilarityChunk, SimilarityChunksSearchRequest, SourceFile, UpdateChunkRequest, UpdateKnowledgeBaseRequest, UploadKnowledgeBaseFileRequest } from "./types";


export class ArtifactClient extends APIResource {
  async listKnowledgeBases(props: ListKnowledgeBasesRequest & { enablePagination: true }): Promise<ListKnowledgeBasesResponse>;
  async listKnowledgeBases(props: ListKnowledgeBasesRequest & { enablePagination: false }): Promise<KnowledgeBase[]>;
  async listKnowledgeBases(props: ListKnowledgeBasesRequest & { enablePagination: boolean }): Promise<ListKnowledgeBasesResponse | KnowledgeBase[]> {
    const { ownerId, pageSize, pageToken, enablePagination } = props;

    try {
      const knowledgeBases: KnowledgeBase[] = [];

      const queryString = getQueryString({
        baseURL: `/namespaces/${ownerId}/knowledge-bases`,
        pageSize,
        pageToken,
      });

      const data = await this._client.get<ListKnowledgeBasesResponse>(queryString);

      if (enablePagination) {
        return Promise.resolve(data);
      }

      knowledgeBases.push(...data.knowledgeBases);

      if (data.nextPageToken) {
        knowledgeBases.push(
          ...(await this.listKnowledgeBases({
            ownerId,
            pageSize,
            pageToken: data.nextPageToken,
            enablePagination: false,
          }))
        );
      }

      return Promise.resolve(knowledgeBases);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getKnowledgeBase({ ownerId, kbId }: GetKnowledgeBaseRequest): Promise<KnowledgeBase> {
    try {
      const data = await this._client.get<{ knowledge_base: KnowledgeBase }>(`/namespaces/${ownerId}/knowledge-bases/${kbId}`);
      return Promise.resolve(data.knowledge_base);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async createKnowledgeBase(props: CreateKnowledgeBaseRequest): Promise<KnowledgeBase> {
    const { ownerId, payload } = props;
    try {
      const data = await this._client.post<{ knowledge_base: KnowledgeBase }>(`/namespaces/${ownerId}/knowledge-bases`, {
        body: JSON.stringify(payload),
      });
      return Promise.resolve(data.knowledge_base);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateKnowledgeBase(props: UpdateKnowledgeBaseRequest): Promise<KnowledgeBase> {
    const { ownerId, kbId, payload } = props;
    try {
      const data = await this._client.patch<{ knowledge_base: KnowledgeBase }>(`/namespaces/${ownerId}/knowledge-bases/${kbId}`, {
        body: JSON.stringify(payload),
      });
      return Promise.resolve(data.knowledge_base);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteKnowledgeBase({ ownerId, kbId }: DeleteKnowledgeBaseRequest): Promise<void> {
    try {
      await this._client.delete(`/namespaces/${ownerId}/knowledge-bases/${kbId}`);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listKnowledgeBaseFiles(props: ListKnowledgeBaseFilesRequest & { enablePagination: true }): Promise<ListKnowledgeBaseFilesResponse>;
  async listKnowledgeBaseFiles(props: ListKnowledgeBaseFilesRequest & { enablePagination: false }): Promise<File[]>;
  async listKnowledgeBaseFiles(props: ListKnowledgeBaseFilesRequest & { enablePagination: boolean }): Promise<ListKnowledgeBaseFilesResponse | File[]> {
    const { ownerId, kbId, pageSize, pageToken, enablePagination } = props;

    try {
      const files: File[] = [];

      const queryString = getQueryString({
        baseURL: `/namespaces/${ownerId}/knowledge-bases/${kbId}/files`,
        pageSize,
        pageToken,
      });

      const data = await this._client.get<ListKnowledgeBaseFilesResponse>(queryString);

      if (enablePagination) {
        return Promise.resolve(data);
      }

      files.push(...data.files);

      if (data.nextPageToken) {
        files.push(
          ...(await this.listKnowledgeBaseFiles({
            ownerId,
            kbId,
            pageSize,
            pageToken: data.nextPageToken,
            enablePagination: false,
          }))
        );
      }

      return Promise.resolve(files);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async uploadKnowledgeBaseFile(props: UploadKnowledgeBaseFileRequest): Promise<File> {
    const { ownerId, kbId, payload } = props;
    try {
      const data = await this._client.post<{ file: File }>(`/namespaces/${ownerId}/knowledge-bases/${kbId}/files`, {
        body: JSON.stringify(payload),
      });
      return Promise.resolve(data.file);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteKnowledgeBaseFile({ fileUid }: DeleteKnowledgeBaseFileRequest): Promise<void> {
    try {
      await this._client.delete(`/knowledge-bases/files?fileUid=${fileUid}`);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listChunks(props: ListChunksRequest & { enablePagination: true }): Promise<ListChunksResponse>;
  async listChunks(props: ListChunksRequest & { enablePagination: false }): Promise<Chunk[]>;
  async listChunks(props: ListChunksRequest & { enablePagination: boolean }): Promise<ListChunksResponse | Chunk[]> {
    const { ownerId, kbId, fileUid, pageSize, pageToken, enablePagination } = props;

    try {
      const chunks: Chunk[] = [];

      const queryString = getQueryString({
        baseURL: `/namespaces/${ownerId}/knowledge-bases/${kbId}/chunks`,
        pageSize,
        pageToken,
        fileUid,
      });

      const data = await this._client.get<ListChunksResponse>(queryString);

      if (enablePagination) {
        return Promise.resolve(data);
      }

      chunks.push(...data.chunks);

      if (data.nextPageToken) {
        chunks.push(
          ...(await this.listChunks({
            ownerId,
            kbId,
            fileUid,
            pageSize,
            pageToken: data.nextPageToken,
            enablePagination: false,
          }))
        );
      }

      return Promise.resolve(chunks);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async updateChunk(props: UpdateChunkRequest): Promise<Chunk> {
    const { chunkUid, retrievable } = props;
    try {
      const data = await this._client.post<{ chunk: Chunk }>(`/chunks/${chunkUid}`, {
        body: JSON.stringify({ retrievable }),
      });
      return Promise.resolve(data.chunk);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getChunkContent({ ownerId, kbId, chunkUid }: GetChunkContentRequest): Promise<string> {
    try {
      const data = await this._client.get<{ content: string }>(`/namespaces/${ownerId}/knowledge-bases/${kbId}/chunks/${chunkUid}/content`);
      return Promise.resolve(data.content);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getFileContent({ ownerId, kbId, fileUid }: GetFileContentRequest): Promise<string> {
    try {
      const data = await this._client.get<{ sourceFile: { content: string } }>(`/namespaces/${ownerId}/knowledge-bases/${kbId}/files/${fileUid}/source`);
      return Promise.resolve(data.sourceFile.content);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getFileDetails({ ownerId, kbId, fileUid }: GetFileDetailsRequest): Promise<File> {
    try {
      const data = await this._client.get<{ file: File }>(`/namespaces/${ownerId}/knowledge-bases/${kbId}/files/${fileUid}`);
      return Promise.resolve(data.file);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getSourceFile({ ownerId, kbId, fileUid }: GetSourceFileRequest): Promise<SourceFile> {
    try {
      const data = await this._client.get<{ sourceFile: SourceFile }>(`/namespaces/${ownerId}/knowledge-bases/${kbId}/files/${fileUid}/source`);
      return Promise.resolve(data.sourceFile);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async processKnowledgeBaseFiles(props: ProcessKnowledgeBaseFilesRequest): Promise<File[]> {
    try {
      const data = await this._client.post<{ files: File[] }>(`/knowledge-bases/files/processAsync`, {
        body: JSON.stringify({ file_uids: props.fileUids }),
      });
      return Promise.resolve(data.files);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async similarityChunksSearch(props: SimilarityChunksSearchRequest): Promise<SimilarityChunk[]> {
    const { ownerId, kbId, payload } = props;
    try {
      const data = await this._client.post<{ similarChunks: SimilarityChunk[] }>(`/namespaces/${ownerId}/knowledge-bases/${kbId}/chunks/similarity`, {
        body: JSON.stringify(payload),
      });
      return Promise.resolve(data.similarChunks);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}