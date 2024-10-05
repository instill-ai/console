import { CreateIntegrationConnectionRequest } from "instill-sdk";

export type OnOAuthCallbackProps = {
  instillAccessToken?: string;
  addConnectionPayload: CreateIntegrationConnectionRequest;
};

export type OnOAuthCallback = (props: OnOAuthCallbackProps) => void;

export type IntegrationProvider = "google" | "slack" | "github";
