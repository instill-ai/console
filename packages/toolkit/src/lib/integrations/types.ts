import type { CreateNamespaceConnectionRequest } from "instill-sdk";

export type OnOAuthCallbackProps = {
  instillAccessToken?: string;
  addConnectionPayload: CreateNamespaceConnectionRequest;
};

export type OnOAuthCallback = (props: OnOAuthCallbackProps) => void;

export type IntegrationProvider =
  | "google-drive"
  | "google-sheets"
  | "slack"
  | "github";
