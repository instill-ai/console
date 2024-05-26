// knowledgeBaseService.ts
import axios from "axios";
import { KnowledgeBase } from "./knowledgeBase";

const API_BASE_URL = "http://localhost:3000"; // Replace with your backend API base URL

export const createKnowledgeBase = async (
  data: Partial<KnowledgeBase>
): Promise<KnowledgeBase> => {
  const response = await axios.post<{ body: KnowledgeBase }>(
    `${API_BASE_URL}/v1alpha/artifact/kb`,
    data
  );
  return response.data.body;
};

export const getKnowledgeBases = async (): Promise<KnowledgeBase[]> => {
  const response = await axios.get<{
    body: { knowledgebases: KnowledgeBase[] };
  }>(`${API_BASE_URL}/v1alpha/artifact/kb`);
  return response.data.body.knowledgebases;
};

export const updateKnowledgeBase = async (
  id: string,
  data: Partial<KnowledgeBase>
): Promise<KnowledgeBase> => {
  const response = await axios.put<{ body: KnowledgeBase }>(
    `${API_BASE_URL}/v1alpha/artifact/kb/${id}`,
    data
  );
  return response.data.body;
};

export const deleteKnowledgeBase = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/v1alpha/artifact/kb/${id}`);
};
