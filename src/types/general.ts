import { ModelState, PipelineState } from "@/lib/instill";
import { ConnectorState } from "@/lib/instill/connector";
import { Dispatch, SetStateAction } from "react";

export type State = PipelineState | ConnectorState | ModelState;

export type Mode = "sync" | "async" | "unspecific";

export type Nullable<T> = T | null;

export type InstillAiUserCookie = {
  cookie_token: string;
};

export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export type UseCustomHookResult<T> = [T, Dispatch<SetStateAction<T>>];
