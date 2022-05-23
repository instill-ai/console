import { ConnectorState, ModelState, PipelineState } from "@/lib/instill";

export type State = PipelineState | ConnectorState | ModelState;

export type Mode = "sync" | "async" | "unspecific";

export type Nullable<T> = T | null;
