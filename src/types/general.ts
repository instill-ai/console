import { ModelState, PipelineState } from "@/lib/instill";
import { ConnectorState } from "@/lib/instill/connector";

export type State = PipelineState | ConnectorState | ModelState;

export type Mode = "sync" | "async" | "unspecific";

export type Nullable<T> = T | null;

export type InstillAiUserCookie = {
  cookie_token: string;
};
