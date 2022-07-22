export type ErrorDetails = {
  "@type": string;
  violations?: {
    type: string;
    description: string;
    subject: string;
  }[];
  description?: string;
};
