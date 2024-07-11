export interface KnowledgeBase {
  kbId: string;
  name: string;
  description: string;
  createTime: string;
  updateTime: string;
  ownerName: string;
  tags: string[];
  convertingPipelines: string[];
  splittingPipelines: string[];
  embeddingPipelines: string[];
  downstreamApps: string[];
}

export type FileSnippet = {
  id: string;
  content: string;
  fileName: string;
  sectionTitle: string;
  chapters: string[][];
  score: number;
};
