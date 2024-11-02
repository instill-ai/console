import { z } from "zod";

export type GetNamespaceRemainingInstillCreditRequest = {
  namespaceId: string;
};

export type GetNamespaceRemainingInstillCreditResponse = z.infer<
  typeof getNamespaceRemainingInstillCreditResponseValidator
>;

export const getNamespaceRemainingInstillCreditResponseValidator = z.object({
  perishable: z.number(),
  imperishable: z.number(),
  total: z.number(),
});
