export type ApiToken = {
  name: string;
  uid: string;
  id: string;
  createTime: string;
  updateTime: string;
  accessToken: string;
  state: ApiTokenState;
  tokenType: string;
  lastUserTime: string;
};

export type ApiTokenState =
  | "STATE_UNSPECIFIED"
  | "STATE_INACTIVE"
  | "STATE_ACTIVE"
  | "STATE_EXPIRED";

export type ListApiTokenRequest = {
  pageSize?: number;
  pageToken?: string;
};

export type ListApiTokensResponse = {
  tokens: ApiToken[];
  nextPageToken: string;
  totalSize: string;
};

export type GetApiTokenRequest = {
  /**
   * The resource name of the token, which allows its access by ID.
   * Format: tokens/{token.id}.
   */
  tokenName: string;
};

export type GetApiTokenResponse = {
  token: ApiToken;
};

export type CreateApiTokenRequest = {
  id: string;
  ttl: number;
};

export type CreateApiTokenResponse = {
  token: ApiToken;
};

export type DeleteApiTokenRequest = {
  /**
   * The resource name of the token, which allows its access by ID.
   * Format: tokens/{token.id}.
   */
  tokenName: string;
};
