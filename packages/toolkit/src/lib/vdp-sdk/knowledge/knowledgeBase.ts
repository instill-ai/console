export interface KnowledgeBase {
  id: string;
  name: string;
  title: string;
  description: string;
  tags:? string[];
  inuse?: boolean;
  create_time?: Date;
  update_time?: Date;
}
