import { AccessToken, Token } from "simple-oauth2";

export type ExchangeTokenApiResponse = {
  status: "error" | "ok";
  error?: string;
  accessToken?: AccessToken;
};

export type RefreshTokenApiResponse = {
  status: "error" | "ok";
  error?: string;
  tokenSet?: Token;
};

export type ValidateTokenApiResponse = {
  status: "error" | "ok";
  error?: string;
  tokenIsValid?: boolean;
  tokenSet?: Token;
};
