export type SmartHint = {
  key: string;
  path: string;
  instillFormat: string;
  type: string;
  properties?: SmartHint[];
  description?: string;
  isInstillCreditHint?: boolean;
};
