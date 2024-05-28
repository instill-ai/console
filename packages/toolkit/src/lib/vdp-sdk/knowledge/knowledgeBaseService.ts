// knowledgeBaseService.ts
import { createInstillAxiosClient } from "../helper";
import { KnowledgeBase } from "./knowledgeBase";

export class KnowledgeBaseService {
  async createKnowledgeBase(
    data: Partial<KnowledgeBase>
  ): Promise<KnowledgeBase> {
    const client = createInstillAxiosClient(accessToken);
    const response = await client.post<{ body: KnowledgeBase }>(
      `/artifact/kb`,
      data
    );
    return response.data.body;
  }

  async getKnowledgeBases(): Promise<KnowledgeBase[]> {
    const client = createInstillAxiosClient(accessToken);
    const response = await client.get<{
      body: { knowledgebases: KnowledgeBase[] };
    }>(`/artifact/kb`);
    return response.data.body.knowledgebases;
  }

  async updateKnowledgeBase(
    id: string,
    data: Partial<KnowledgeBase>
  ): Promise<KnowledgeBase> {
    const client = createInstillAxiosClient(accessToken);
    const response = await client.patch<{ body: KnowledgeBase }>(
      `/artifact/kb/${id}`,
      data
    );
    return response.data.body;
  }

  async deleteKnowledgeBase(id: string): Promise<void> {
    const client = createInstillAxiosClient(accessToken);
    await client.delete(`/artifact/kb/${id}`);
  }
}
