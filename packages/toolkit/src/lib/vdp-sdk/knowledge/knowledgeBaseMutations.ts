// lib/vdp-sdk/knowledge/knowledgeBaseMutations.ts
import { createInstillAxiosClient } from "../helper";
import { KnowledgeBase } from "./knowledgeBase";

export async function createKnowledgeBaseMutation({
  payload,
  accessToken,
}: {
  payload: Partial<KnowledgeBase>;
  accessToken: string | null;
}) {
  const client = createInstillAxiosClient(accessToken);
  const response = await client.post<{ body: KnowledgeBase }>(
    `/artifact/kb`,
    payload
  );
  return response.data.body;
}

export async function getKnowledgeBasesMutation({
  accessToken,
}: {
  accessToken: string | null;
}) {
  const client = createInstillAxiosClient(accessToken);
  const response = await client.get<{
    body: { knowledgebases: KnowledgeBase[] };
  }>(`/artifact/kb`);
  return response.data.body.knowledgebases;
}

export async function updateKnowledgeBaseMutation({
  id,
  payload,
  accessToken,
}: {
  id: string;
  payload: Partial<KnowledgeBase>;
  accessToken: string | null;
}) {
  const client = createInstillAxiosClient(accessToken);
  const response = await client.patch<{ body: KnowledgeBase }>(
    `/artifact/kb/${id}`,
    payload
  );
  return response.data.body;
}

export async function deleteKnowledgeBaseMutation({
  id,
  accessToken,
}: {
  id: string;
  accessToken: string | null;
}) {
  const client = createInstillAxiosClient(accessToken);
  await client.delete(`/artifact/kb/${id}`);
}
