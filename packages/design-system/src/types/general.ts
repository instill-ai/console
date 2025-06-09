export type Nullable<T> = T | null;

export type State = PipelineState | ModelState | "STATE_LOADING";

export type PipelineState =
  | "STATE_UNSPECIFIED"
  | "STATE_ACTIVE"
  | "STATE_INACTIVE"
  | "STATE_ERROR"
  | "STATE_DELETED";

export type ModelState =
  | "STATE_UNSPECIFIED"
  | "STATE_STARTING"
  | "STATE_OFFLINE"
  | "STATE_SCALING_UP"
  | "STATE_SCALING_DOWN"
  | "STATE_ACTIVE"
  | "STATE_IDLE"
  | "STATE_ERROR";

export type IconStyle = {
  width: string;
  height: string;
  position?: string;
  color?: string;
};

export type PipelineMode = "MODE_UNSPECIFIED" | "MODE_SYNC" | "MODE_ASYNC";

export type IconStyleWithoutColor = Omit<IconStyle, "color">;

export type SelectOption = {
  label: string;
  value: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
};
