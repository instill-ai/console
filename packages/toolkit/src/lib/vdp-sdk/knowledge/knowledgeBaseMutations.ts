import { KnowledgeBase } from "./knowledgeBase";
import { KnowledgeBaseService } from "./knowledgeBaseService";

const knowledgeBaseService = new KnowledgeBaseService();

export async function createKnowledgeBaseMutation({
  payload,
  accessToken,
}: {
  payload: Partial<KnowledgeBase>;
  accessToken: string | null;
}) {
  return knowledgeBaseService.createKnowledgeBase(payload, accessToken);
}

export async function getKnowledgeBasesMutation({
  accessToken,
  uid,
}: {
  accessToken: string | null;
  uid: string;
}) {
  return knowledgeBaseService.getKnowledgeBases(accessToken, uid);
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
  return knowledgeBaseService.updateKnowledgeBase(id, payload, accessToken);
}

export async function deleteKnowledgeBaseMutation({
  id,
  accessToken,
}: {
  id: string;
  accessToken: string | null;
}) {
  await knowledgeBaseService.deleteKnowledgeBase(id, accessToken);
}
