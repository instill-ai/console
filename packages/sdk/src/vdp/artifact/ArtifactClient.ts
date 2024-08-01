import { getQueryString } from "../../helper";
import { InstillAPIClient } from "../../main";
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

export class ArtifactClient {
  private client: InstillAPIClient;

  constructor(client: InstillAPIClient) {
    this.client = client;
  }

  async listKnowledgeBases(
    props: ListKnowledgeBasesRequest,
  ): Promise<ListKnowledgeBasesResponse> {
    const { ownerId, pageSize, pageToken } = props;
    const queryString = getQueryString({
      baseURL: `/namespaces/${ownerId}/knowledge-bases`,
      pageSize,
      pageToken,
    });
    return this.client.get<ListKnowledgeBasesResponse>(queryString);
  }

  async createKnowledgeBase(
    props: CreateKnowledgeBaseRequest,
  ): Promise<KnowledgeBase> {
    const { ownerId, payload } = props;
    const response = await this.client.post<{ knowledge_base: KnowledgeBase }>(
      `/namespaces/${ownerId}/knowledge-bases`,
      { body: JSON.stringify(payload) },
    );
    return response.knowledge_base;
  }

  async deleteKnowledgeBaseFile(
    props: DeleteKnowledgeBaseFileRequest,
  ): Promise<void> {
    const { ownerId, kbId, fileUid } = props;
    await this.client.delete(
      `/namespaces/${ownerId}/knowledge-bases/${kbId}/files/${fileUid}`,
    );
  }

  async updateKnowledgeBase(
    props: UpdateKnowledgeBaseRequest,
  ): Promise<KnowledgeBase> {
    const { ownerId, kbId, payload } = props;
    const response = await this.client.patch<{ knowledge_base: KnowledgeBase }>(
      `/namespaces/${ownerId}/knowledge-bases/${kbId}`,
      { body: JSON.stringify(payload) },
    );
    return response.knowledge_base;
  }

  async deleteKnowledgeBase(props: DeleteKnowledgeBaseRequest): Promise<void> {
    const { ownerId, kbId } = props;
    await this.client.delete(`/namespaces/${ownerId}/knowledge-bases/${kbId}`);
  }

  async listKnowledgeBaseFiles(
    props: ListKnowledgeBaseFilesRequest,
  ): Promise<ListKnowledgeBaseFilesResponse> {
    const { ownerId, kbId, pageSize, pageToken } = props;
    const response = await this.client.get<ListKnowledgeBaseFilesResponse>(
      `/namespaces/${ownerId}/knowledge-bases/${kbId}/files`,
      {
        params: { pageSize, pageToken },
      },
    );
    return response;
  }

  async uploadKnowledgeBaseFile(
    props: UploadKnowledgeBaseFileRequest,
  ): Promise<File> {
    const { ownerId, kbId, payload } = props;
    const response = await this.client.post<{ file: File }>(
      `/namespaces/${ownerId}/knowledge-bases/${kbId}/files`,
      { body: JSON.stringify(payload) },
    );
    return response.file;
  }

  async listChunks(props: ListChunksRequest): Promise<ListChunksResponse> {
    const { ownerId, kbId, fileUid, pageSize, pageToken } = props;
    const response = await this.client.get<ListChunksResponse>(
      `/namespaces/${ownerId}/knowledge-bases/${kbId}/chunks`,
      {
        params: { fileUid, pageSize, pageToken },
      },
    );
    return response;
  }

  async updateChunk(props: UpdateChunkRequest): Promise<Chunk> {
    const { chunkUid, retrievable } = props;
    const response = await this.client.post<{ chunk: Chunk }>(
      `/chunks/${chunkUid}`,
      { body: JSON.stringify({ retrievable }) },
    );
    return response.chunk;
  }

  async getChunkContent(props: GetChunkContentRequest): Promise<string> {
    const { ownerId, kbId, chunkUid } = props;
    const response = await this.client.get<{ content: string }>(
      `/namespaces/${ownerId}/knowledge-bases/${kbId}/chunks/${chunkUid}/content`,
    );
    return response.content;
  }

  async getFileContent(props: GetFileContentRequest): Promise<string> {
    const { ownerId, kbId, fileUid } = props;
    const response = await this.client.get<{ sourceFile: { content: string } }>(
      `/namespaces/${ownerId}/knowledge-bases/${kbId}/files/${fileUid}/source`,
    );
    return response.sourceFile.content;
  }

  async getFileDetails(props: GetFileDetailsRequest): Promise<File> {
    const { ownerId, kbId, fileUid } = props;
    const response = await this.client.get<{ file: File }>(
      `/namespaces/${ownerId}/knowledge-bases/${kbId}/files/${fileUid}`,
    );
    return response.file;
  }

  async getSourceFile(props: GetSourceFileRequest): Promise<SourceFile> {
    const { ownerId, kbId, fileUid } = props;
    const response = await this.client.get<{ sourceFile: SourceFile }>(
      `/namespaces/${ownerId}/knowledge-bases/${kbId}/files/${fileUid}/source`,
    );
    return response.sourceFile;
  }

  async processKnowledgeBaseFiles(
    props: ProcessKnowledgeBaseFilesRequest,
  ): Promise<File[]> {
    const response = await this.client.post<{ files: File[] }>(
      `/knowledge-bases/files/processAsync`,
      { body: JSON.stringify({ file_uids: props.fileUids }) },
    );
    return response.files;
  }

  async similarityChunksSearch(
    props: SimilarityChunksSearchRequest,
  ): Promise<SimilarityChunk[]> {
    const { ownerId, kbId, payload } = props;
    const response = await this.client.post<{
      similarChunks: SimilarityChunk[];
    }>(`/namespaces/${ownerId}/knowledge-bases/${kbId}/chunks/similarity`, {
      body: JSON.stringify(payload),
    });
    return response.similarChunks;
  }
}
