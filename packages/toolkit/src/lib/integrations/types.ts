import { AddIntegrationRequest } from "instill-sdk";

export type OnOAuthCallbackProps = {
  instillAccessToken?: string;
  addConnectionPayload: AddIntegrationRequest;
};

export type OnOAuthCallback = (props: OnOAuthCallbackProps) => void;

export type IntegrationProvider = "google" | "slack" | "github";
