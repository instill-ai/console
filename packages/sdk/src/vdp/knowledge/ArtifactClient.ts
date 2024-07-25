import { File, KnowledgeBase } from './../../../../toolkit/src/lib/vdp-sdk/knowledge/types';
import { AxiosInstance } from "axios";

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

}