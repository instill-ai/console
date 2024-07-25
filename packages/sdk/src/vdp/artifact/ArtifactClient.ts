import { AxiosInstance } from "axios";
import { KnowledgeBase, File, Chunk, SourceFile, SimilarityChunk } from "./types";

export class ArtifactClient {
  constructor(private client: AxiosInstance) {}

  async createKnowledgeBase(ownerId: string, payload: any): Promise<KnowledgeBase> {
    const response = await this.client.post<{ knowledge_base: KnowledgeBase }>(
      `/namespaces/${ownerId}/knowledge-bases`,
      payload
    );
    return response.data.knowledge_base;
  }

  async listKnowledgeBasesFiles(ownerId: string, kbId: string): Promise<File[]> {
    const response = await this.client.get<{ files: File[] }>(
      `/namespaces/${ownerId}/knowledge-bases/${kbId}/files`
    );
    return response.data.files;
  }

  async updateKnowledgeBase(ownerId: string, kbId: string, payload: any): Promise<KnowledgeBase> {
    const response = await this.client.patch<{ knowledge_base: KnowledgeBase }>(
      `/namespaces/${ownerId}/knowledge-bases/${kbId}`,
      payload
    );
    return response.data.knowledge_base;
  }

  async deleteKnowledgeBase(ownerId: string, kbId: string): Promise<void> {
    await this.client.delete(`/namespaces/${ownerId}/knowledge-bases/${kbId}`);
  }

  async deleteKnowledgeBaseFile(fileUid: string): Promise<void> {
    await this.client.delete(`/knowledge-bases/files?fileUid=${fileUid}`);
  }

  async getChunkContent(ownerId: string, kbId: string, chunkUid: string): Promise<string> {
    const response = await this.client.get<{ content: string }>(
      `/namespaces/${ownerId}/knowledge-bases/${kbId}/chunks/${chunkUid}/content`
    );
    return response.data.content;
  }

  async getFileContent(ownerId: string, kbId: string, fileUid: string): Promise<string> {
    const response = await this.client.get<{ sourceFile: { content: string } }>(
      `/namespaces/${ownerId}/knowledge-bases/${kbId}/files/${fileUid}/source`
    );
    return response.data.sourceFile.content;
  }

  async getFileDetails(ownerId: string, kbId: string, fileUid: string): Promise<File> {
    const response = await this.client.get<{ file: File }>(
      `/namespaces/${ownerId}/knowledge-bases/${kbId}/files/${fileUid}`
    );
    return response.data.file;
  }

  async getKnowledgeBases(ownerId: string): Promise<KnowledgeBase[]> {
    const response = await this.client.get<{ knowledgeBases: KnowledgeBase[] }>(
      `/namespaces/${ownerId}/knowledge-bases`
    );
    return response.data.knowledgeBases || [];
  }

  async getSourceFile(ownerId: string, kbId: string, fileUid: string): Promise<SourceFile> {
    const response = await this.client.get<{ sourceFile: SourceFile }>(
      `/namespaces/${ownerId}/knowledge-bases/${kbId}/files/${fileUid}/source`
    );
    return response.data.sourceFile;
  }

  async listChunks(ownerId: string, kbId: string, fileUid: string): Promise<Chunk[]> {
    const response = await this.client.get<{ chunks: Chunk[] }>(
      `/namespaces/${ownerId}/knowledge-bases/${kbId}/chunks`,
      { params: { fileUid } }
    );
    return response.data.chunks;
  }

  async processKnowledgeBaseFiles(fileUids: string[]): Promise<File[]> {
    const response = await this.client.post<{ files: File[] }>(
      `/knowledge-bases/files/processAsync`,
      { file_uids: fileUids }
    );
    return response.data.files;
  }

  async similarityChunksSearch(ownerId: string, kbId: string, payload: { textPrompt: string; topk: number }): Promise<SimilarityChunk[]> {
    const response = await this.client.post<{ similarChunks: SimilarityChunk[] }>(
      `/namespaces/${ownerId}/knowledge-bases/${kbId}/chunks/similarity`,
      payload
    );
    return response.data.similarChunks;
  }

  async updateChunk(chunkUid: string, retrievable: boolean): Promise<Chunk> {
    const response = await this.client.post<{ chunk: Chunk }>(`/chunks/${chunkUid}`, {
      retrievable,
    });
    return response.data.chunk;
  }

  async uploadKnowledgeBaseFile(ownerId: string, knowledgeBaseId: string, payload: { name: string; type: string; content: string }): Promise<File> {
    const response = await this.client.post<{ file: File }>(
      `/namespaces/${ownerId}/knowledge-bases/${knowledgeBaseId}/files`,
      payload
    );
    return response.data.file;
  }
}