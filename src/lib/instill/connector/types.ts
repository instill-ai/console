import { Nullable } from "@/types/general";
import type { JSONSchema7 } from "json-schema";

/* eslint-disable  @typescript-eslint/no-explicit-any */

export type ConnectorState =
  | "STATE_CONNECTED"
  | "STATE_DISCONNECTED"
  | "STATE_ERROR"
  | "STATE_UNSPECIFIED";

export type Connector = {
  description: string;
  configuration: Record<string, any>;
  tombstone: boolean;
  user: string;
  org: string;
  create_time: string;
  update_time: string;
  state: ConnectorState;
};

export type ConnectorDefinition = {
  name: string;
  uid: string;
  id: string;
  connector_definition: {
    title: string;
    docker_repository: string;
    docker_image_tag: string;
    documentation_url: string;
    icon: string;
    connection_type: string;
    spec: {
      documentation_url: string;
      changelog_url?: string;
      connection_specification: JSONSchema7;
      supports_incremental: boolean;
      supports_normalization: boolean;
      supports_dbt: boolean;
      supported_destination_sync_modes: string[];
      advanced_auth: Nullable<Record<string, any>>;
    };
    tombstone: boolean;
    public: boolean;
    custom: boolean;
    release_stage: string;
    release_date: {
      year: number;
      month: number;
      day: number;
    };
    resource_requirements: Record<string, any>;
    create_time: string;
    update_time: string;
  };
};
