import { Pipeline } from "../../pipeline";
import { Connector, ConnectorDefinition } from "../types";

export type Source = {
  name: string;
  uid: string;
  id: string;
  source_connector_definition: string;
  connector: Connector;
};

export type SourceWithDefinition = {
  name: string;
  uid: string;
  id: string;
  source_connector_definition: ConnectorDefinition;
  connector: Connector;
};

export type SourceWithPipelines = SourceWithDefinition & {
  pipelines: Pipeline[];
};
