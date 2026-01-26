export type APIToken = {
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

export type ListPaginatedAPITokenRequest = {
  pageSize?: number;
  pageToken?: string;
};

export type ListPaginatedAPITokensResponse = {
  tokens: APIToken[];
  nextPageToken: string;
  totalSize: string;
};

export type ListAPITokenRequest = {
  pageSize?: number;
  pageToken?: string;
};

export type ListAPITokensResponse = {
  tokens: APIToken[];
};

export type GetAPITokenRequest = {
  tokenId: string;
};

export type GetAPITokenResponse = {
  token: APIToken;
};

export type CreateAPITokenRequest = {
  id: string;
  ttl: number;
};

export type CreateAPITokenResponse = {
  token: APIToken;
};

export type DeleteAPITokenRequest = {
  tokenId: string;
};
