import { getQueryString } from "../../helper";
import { APIResource } from "../../main/resource";
import {
  Chunk,
  CreateKnowledgeBaseRequest,
  DeleteKnowledgeBaseFileRequest,
  DeleteKnowledgeBaseRequest,
  File,
  GetChunkContentRequest,
  GetFileContentRequest,
  GetFileDetailsRequest,
  GetSourceFileRequest,
  KnowledgeBase,
  ListChunksRequest,
  ListChunksResponse,
  ListKnowledgeBaseFilesRequest,
  ListKnowledgeBaseFilesResponse,
  ListKnowledgeBasesRequest,
  ListKnowledgeBasesResponse,
  ProcessKnowledgeBaseFilesRequest,
  SimilarityChunk,
  SimilarityChunksSearchRequest,
  SourceFile,
  UpdateChunkRequest,
  UpdateKnowledgeBaseRequest,
  UploadKnowledgeBaseFileRequest,
} from "./types";

export class ArtifactClient extends APIResource {
  async listKnowledgeBases(
    props: ListKnowledgeBasesRequest,
  ): Promise<ListKnowledgeBasesResponse> {
    const { ownerId, pageSize, pageToken } = props;
    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${ownerId}/knowledge-bases`,
        pageSize,
        pageToken,
      });
      const data =
        await this._client.get<ListKnowledgeBasesResponse>(queryString);
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async createKnowledgeBase(
    props: CreateKnowledgeBaseRequest,
  ): Promise<KnowledgeBase> {
    const { ownerId, payload } = props;
    try {
      const data = await this._client.post<{ knowledge_base: KnowledgeBase }>(
        `/namespaces/${ownerId}/knowledge-bases`,
        { body: JSON.stringify(payload) },
      );
      return Promise.resolve(data.knowledge_base);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateKnowledgeBase(
    props: UpdateKnowledgeBaseRequest,
  ): Promise<KnowledgeBase> {
    const { ownerId, kbId, payload } = props;
    try {
      const data = await this._client.patch<{ knowledge_base: KnowledgeBase }>(
        `/namespaces/${ownerId}/knowledge-bases/${kbId}`,
        { body: JSON.stringify(payload) },
      );
      return Promise.resolve(data.knowledge_base);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteKnowledgeBase(props: DeleteKnowledgeBaseRequest): Promise<void> {
    const { ownerId, kbId } = props;
    try {
      await this._client.delete(
        `/namespaces/${ownerId}/knowledge-bases/${kbId}`,
      );
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listKnowledgeBaseFiles(
    props: ListKnowledgeBaseFilesRequest,
  ): Promise<ListKnowledgeBaseFilesResponse> {
    const { ownerId, kbId, pageSize, pageToken } = props;
    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${ownerId}/knowledge-bases/${kbId}/files`,
        pageSize,
        pageToken,
      });
      const data =
        await this._client.get<ListKnowledgeBaseFilesResponse>(queryString);
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async uploadKnowledgeBaseFile(
    props: UploadKnowledgeBaseFileRequest,
  ): Promise<File> {
    const { ownerId, kbId, payload } = props;
    try {
      const data = await this._client.post<{ file: File }>(
        `/namespaces/${ownerId}/knowledge-bases/${kbId}/files`,
        { body: JSON.stringify(payload) },
      );
      return Promise.resolve(data.file);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteKnowledgeBaseFile(
    props: DeleteKnowledgeBaseFileRequest,
  ): Promise<void> {
    const { ownerId, kbId, fileUid } = props;
    try {
      await this._client.delete(
        `/namespaces/${ownerId}/knowledge-bases/${kbId}/files/${fileUid}`,
      );
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listChunks(props: ListChunksRequest): Promise<ListChunksResponse> {
    const { ownerId, kbId, fileUid, pageSize, pageToken } = props;
    try {
      const queryParams = new URLSearchParams();
      if (fileUid) queryParams.append("fileUid", fileUid);
      if (pageSize) queryParams.append("pageSize", pageSize.toString());
      if (pageToken) queryParams.append("pageToken", pageToken);

      const baseURL = `/namespaces/${ownerId}/knowledge-bases/${kbId}/chunks`;
      const fullUrl = `${baseURL}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

      const data = await this._client.get<ListChunksResponse>(fullUrl);
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateChunk(props: UpdateChunkRequest): Promise<Chunk> {
    const { chunkUid, retrievable } = props;
    try {
      const data = await this._client.post<{ chunk: Chunk }>(
        `/chunks/${chunkUid}`,
        { body: JSON.stringify({ retrievable }) },
      );
      return Promise.resolve(data.chunk);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getChunkContent(props: GetChunkContentRequest): Promise<string> {
    const { ownerId, kbId, chunkUid } = props;
    try {
      const data = await this._client.get<{ content: string }>(
        `/namespaces/${ownerId}/knowledge-bases/${kbId}/chunks/${chunkUid}/content`,
      );
      return Promise.resolve(data.content);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getFileContent(props: GetFileContentRequest): Promise<string> {
    const { ownerId, kbId, fileUid } = props;
    try {
      const data = await this._client.get<{ sourceFile: { content: string } }>(
        `/namespaces/${ownerId}/knowledge-bases/${kbId}/files/${fileUid}/source`,
      );
      return Promise.resolve(data.sourceFile.content);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getFileDetails(props: GetFileDetailsRequest): Promise<File> {
    const { ownerId, kbId, fileUid } = props;
    try {
      const data = await this._client.get<{ file: File }>(
        `/namespaces/${ownerId}/knowledge-bases/${kbId}/files/${fileUid}`,
      );
      return Promise.resolve(data.file);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getSourceFile(props: GetSourceFileRequest): Promise<SourceFile> {
    const { ownerId, kbId, fileUid } = props;
    try {
      const data = await this._client.get<{ sourceFile: SourceFile }>(
        `/namespaces/${ownerId}/knowledge-bases/${kbId}/files/${fileUid}/source`,
      );
      return Promise.resolve(data.sourceFile);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async processKnowledgeBaseFiles(
    props: ProcessKnowledgeBaseFilesRequest,
  ): Promise<File[]> {
    try {
      const data = await this._client.post<{ files: File[] }>(
        `/knowledge-bases/files/processAsync`,
        { body: JSON.stringify({ file_uids: props.fileUids }) },
      );
      return Promise.resolve(data.files);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async similarityChunksSearch(
    props: SimilarityChunksSearchRequest,
  ): Promise<SimilarityChunk[]> {
    const { ownerId, kbId, payload } = props;
    try {
      const data = await this._client.post<{
        similarChunks: SimilarityChunk[];
      }>(`/namespaces/${ownerId}/knowledge-bases/${kbId}/chunks/similarity`, {
        body: JSON.stringify(payload),
      });
      return Promise.resolve(data.similarChunks);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
