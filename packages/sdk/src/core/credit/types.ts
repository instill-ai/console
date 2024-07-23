import { z } from "zod";

export type GetRemainingInstillCreditRequest = {
  /**
   * The user or organization to which the credit belongs.
   * Format: {[users|organizations]}/{id}.
   */
  ownerName: string;
};

export type GetRemainingInstillCreditResponse = {
  perishable: number;
  imperishable: number;
  total: number;
};

export const getRemainingInstillCreditResponseValidator = z.object({
  perishable: z.number(),
  imperishable: z.number(),
  total: z.number(),
});
