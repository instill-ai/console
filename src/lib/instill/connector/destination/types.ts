import { Pipeline } from "../../pipeline";
import { Connector, ConnectorDefinition } from "../types";

export type Destination = {
  name: string;
  uid: string;
  id: string;
  destination_connector_definition: string;
  connector: Connector;
};

export type DestinationWithDefinition = {
  name: string;
  uid: string;
  id: string;
  destination_connector_definition: ConnectorDefinition;
  connector: Connector;
};

export type DestinationWithPipelines = DestinationWithDefinition & {
  pipelines: Pipeline[];
};
