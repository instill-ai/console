import { GeneralRecord } from "../../type";
import { Spec } from "../types";

export type ConnectorType =
  | "CONNECTOR_TYPE_UNSPECIFIED"
  | "CONNECTOR_TYPE_OPERATOR"
  | "CONNECTOR_TYPE_DATA"
  | "CONNECTOR_TYPE_AI"
  | "CONNECTOR_TYPE_APPLICATION";

export type ConnectorDefinition = {
  name: string;
  uid: string;
  id: string;
  title: string;
  documentation_url: string;
  icon: string;
  icon_url: string;
  type: ConnectorType;
  spec: Spec;
  tombstone: boolean;
  public: boolean;
  custom: boolean;
  vendor: string;
  vendor_attributes: GeneralRecord;
};
