export type StartOperatorBody = Record<string, StartOperatorInput>;

export type StartOperatorInputBodyValue = Record<string, any>;

export type StartOperatorInput = {
  title: string;
  type: "text" | "number" | "boolean" | "audio" | "image";
};

export type DataConnectorNodeInput = Record<string, string>;
