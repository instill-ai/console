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
