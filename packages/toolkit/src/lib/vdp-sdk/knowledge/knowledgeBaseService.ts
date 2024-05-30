import { createInstillAxiosClient } from "../helper";
import { KnowledgeBase } from "./knowledgeBase";

export class KnowledgeBaseService {
  async createKnowledgeBase(
    data: Partial<KnowledgeBase>,
    accessToken: string | null
  ): Promise<KnowledgeBase> {
    const client = createInstillAxiosClient(accessToken);
    const response = await client.post<{
      body: KnowledgeBase;
      error_msg: string;
      status_code: number;
    }>(`/v1alpha/knowledge-base`, data);
    return response.data.body;
  }

  async getKnowledgeBases(
    accessToken: string | null,
    uid: string
  ): Promise<KnowledgeBase[]> {
    const client = createInstillAxiosClient(accessToken);
    const response = await client.get<{
      body: { knowledge_bases: KnowledgeBase[] };
      error_msg: string;
      status_code: number;
    }>(`/v1alpha/users/${uid}/knowledge-base`);
    return response.data.body.knowledge_bases;
  }

  async updateKnowledgeBase(
    id: string,
    data: Partial<KnowledgeBase>,
    accessToken: string | null
  ): Promise<KnowledgeBase> {
    const client = createInstillAxiosClient(accessToken);
    const response = await client.put<{
      body: KnowledgeBase;
      error_msg: string;
      status_code: number;
    }>(`/v1alpha/knowledge-base/${id}`, data);
    return response.data.body;
  }

  async deleteKnowledgeBase(
    id: string,
    accessToken: string | null
  ): Promise<void> {
    const client = createInstillAxiosClient(accessToken);
    await client.delete<{
      error_msg: string;
      status_code: number;
    }>(`/v1alpha/knowledge-base/${id}`);
  }
}
