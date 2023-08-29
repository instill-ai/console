import {
  ConnectorDefinition,
  ConnectorResource,
  Nullable,
  Pipeline,
  PipelineState,
} from "@instill-ai/toolkit";

export type ConnectorNodeData = {
  nodeType: "connector";
  component: PipelineConnectorComponent;
};

export type EmptyNodeData = {
  nodeType: "empty";
  component: null;
};

export type StartNodeData = {
  nodeType: "start";
  component: PipelineStartComponent;
};

export type EndNodeData = {
  nodeType: "end";
  component: PipelineEndComponent;
};

export type NodeData =
  | ConnectorNodeData
  | EmptyNodeData
  | StartNodeData
  | EndNodeData;

export type ComponentInputField = {
  display_name: string;
  type: string;
};

export type PipelineStartComponent = {
  id: "start";
  resource_name: string;
  resource_detail: Nullable<ConnectorResource>;
  type: PipelineComponentType;
  definition_name: string;
  definition_detail: Nullable<ConnectorDefinition>;
  configuration: Record<
    string,
    Record<
      string,
      { title: string; type: "text" | "image" | "number" | "audio" | "boolean" }
    >
  >;
};

export type PipelineEndComponent = {
  id: "end";
  resource_name: string;
  resource_detail: Nullable<ConnectorResource>;
  type: PipelineComponentType;
  definition_name: string;
  definition_detail: Nullable<ConnectorDefinition>;
  configuration: Record<
    string,
    Record<string, { title: string; value: string }>
  >;
};

export type PipelineComponentType =
  | "COMPONENT_TYPE_CONNECTOR_AI"
  | "COMPONENT_TYPE_CONNECTOR_DATA"
  | "COMPONENT_TYPE_CONNECTOR_BLOCKCHAIN"
  | "COMPONENT_TYPE_OPERATOR";

export type PipelineConnectorComponent = {
  id: string;
  resource_name: string;
  resource_detail: Nullable<ConnectorResource>;
  type: PipelineComponentType;
  definition_name: string;
  definition_detail: Nullable<ConnectorDefinition>;
  configuration: Record<string, any>;
};

export type PipelineComponent =
  | PipelineStartComponent
  | PipelineEndComponent
  | PipelineConnectorComponent;

export type NewPipeline = Omit<Pipeline, "recipe"> & {
  recipe: {
    version: string;
    components: PipelineComponent[];
  };
};

export type NewPipelineWithWatchState = {
  watchState: PipelineState;
} & NewPipeline;

const mock = {
  name: "connector-resources/hello",
  uid: "ab10fd6b-fb75-4af8-9a85-6b6043f9f14d",
  id: "hello",
  connector_definition_name: "connector-definitions/blockchain-numbers",
  connector_type: "CONNECTOR_TYPE_BLOCKCHAIN",
  task: "TASK_UNSPECIFIED",
  description: "",
  configuration: {
    asset_type: "images",
    capture_token: "*****MASK*****",
    metadata_metadata: false,
    metadata_structured_data: false,
    metadata_texts: true,
  },
  state: "STATE_DISCONNECTED",
  tombstone: false,
  user: "users/0cea9b0b-8ada-4ad3-97a6-f32fcccdebaa",
  create_time: "2023-08-25T02:32:04.889295Z",
  update_time: "2023-08-25T02:32:04.899701Z",
  visibility: "VISIBILITY_UNSPECIFIED",
  connector_definition: {
    name: "connector-definitions/blockchain-numbers",
    uid: "70d8664a-d512-4517-a5e8-5d4da81756a7",
    id: "blockchain-numbers",
    title: "Numbers Protocol",
    documentation_url:
      "https://www.instill.tech/docs/vdp/blockchain-connectors/numbers",
    icon: "numbers.svg",
    spec: {
      resource_specification: {
        $schema: "http://json-schema.org/draft-07/schema#",
        additionalProperties: false,
        properties: {
          capture_token: {
            credential_field: true,
            description:
              "Fill your Capture token in the Capture App. To access your tokens, you need a Capture App account and you can sign in with email or wallet to acquire the Capture Token.",
            title: "Capture token",
            type: "string",
          },
        },
        required: ["capture_token"],
        title: "Numbers Protocol Blockchain Connector Spec",
        type: "object",
      },
      component_specification: {
        $schema: "http://json-schema.org/draft-07/schema#",
        properties: {
          abstract: {
            format: "instill-template-text",
            title: "Abstract",
            type: "string",
          },
          asset_creator: {
            format: "instill-template-text",
            title: "Asset Creator",
            type: "string",
          },
          custom: {
            properties: {
              creator_wallet: {
                format: "instill-template-text",
                title: "Creator Wallet",
                type: "string",
              },
              digital_source_type: {
                default: "trainedAlgorithmicMedia",
                enum: [
                  "trainedAlgorithmicMedia",
                  "trainedAlgorithmicData",
                  "digitalCapture",
                  "digitalArt",
                  "algorithmicMedia",
                ],
                title: "Digital Source Type",
                type: "string",
              },
              generated_by: {
                format: "instill-template-text",
                title: "Generated By",
                type: "string",
              },
              generated_through: {
                default: "https://console.instill.tech",
                format: "instill-template-text",
                title: "Generated Through",
                type: "string",
              },
              license: {
                properties: {
                  document: {
                    description: "Url to the license document",
                    format: "instill-template-text",
                    title: "License Document",
                    type: "string",
                  },
                  name: {
                    format: "instill-template-text",
                    title: "License Name",
                    type: "string",
                  },
                },
                title: "License",
                type: "object",
              },
              mining_preference: {
                default: "notAllowed",
                enum: [
                  "dataMining",
                  "aiInference",
                  "notAllowed",
                  "aiGenerativeTraining",
                  "aiGenerativeTrainingWithAuthorship",
                  "aiTraining",
                  "aiTrainingWithAuthorship",
                ],
                title: "Mining Preference",
                type: "string",
              },
            },
            title: "Custom",
            type: "object",
          },
          images: {
            format: "instill-template-image-array",
            items: {
              contentEncoding: "base64",
              format: "images",
              type: "string",
            },
            title: "Images",
            type: "string",
          },
        },
        required: ["images"],
        title: "Numbers Protocol Blockchain Component Spec",
        type: "object",
      },
      openapi_specifications: {
        default: {
          info: {
            title: "Numbers Connector Openapi",
            version: "1.0.0",
          },
          openapi: "3.0.0",
          paths: {
            "/execute": {
              post: {
                requestBody: {
                  content: {
                    "application/json": {
                      schema: {
                        properties: {
                          inputs: {
                            items: {
                              properties: {
                                abstract: {
                                  title: "Abstract",
                                  type: "string",
                                },
                                asset_creator: {
                                  title: "Asset Creator",
                                  type: "string",
                                },
                                custom: {
                                  properties: {
                                    creator_wallet: {
                                      title: "Creator Wallet",
                                      type: "string",
                                    },
                                    digital_source_type: {
                                      default: "trainedAlgorithmicMedia",
                                      enum: [
                                        "trainedAlgorithmicMedia",
                                        "trainedAlgorithmicData",
                                        "digitalCapture",
                                        "digitalArt",
                                        "algorithmicMedia",
                                      ],
                                      title: "Digital Source Type",
                                      type: "string",
                                    },
                                    generated_by: {
                                      title: "Generated By",
                                      type: "string",
                                    },
                                    generated_through: {
                                      default: "https://console.instill.tech",
                                      title: "Generated Through",
                                      type: "string",
                                    },
                                    license: {
                                      properties: {
                                        document: {
                                          description:
                                            "Url to the license document",
                                          title: "License Document",
                                          type: "string",
                                        },
                                        name: {
                                          title: "License Name",
                                          type: "string",
                                        },
                                      },
                                      title: "License",
                                      type: "object",
                                    },
                                    mining_preference: {
                                      default: "notAllowed",
                                      enum: [
                                        "dataMining",
                                        "aiInference",
                                        "notAllowed",
                                        "aiGenerativeTraining",
                                        "aiGenerativeTrainingWithAuthorship",
                                        "aiTraining",
                                        "aiTrainingWithAuthorship",
                                      ],
                                      title: "Mining Preference",
                                      type: "string",
                                    },
                                  },
                                  title: "Custom",
                                  type: "object",
                                },
                                images: {
                                  items: {
                                    contentEncoding: "base64",
                                    format: "images",
                                    type: "string",
                                  },
                                  title: "Images",
                                  type: "array",
                                },
                              },
                              type: "object",
                            },
                            type: "array",
                          },
                        },
                        type: "object",
                      },
                    },
                  },
                  required: true,
                },
                responses: {
                  "200": {
                    content: {
                      "application/json": {
                        schema: {
                          properties: {
                            outputs: {
                              items: {
                                properties: {
                                  asset_urls: {
                                    items: {
                                      type: "string",
                                    },
                                    type: "array",
                                  },
                                },
                                required: ["asset_urls"],
                                type: "object",
                              },
                              type: "array",
                            },
                          },
                          type: "object",
                        },
                      },
                    },
                    description: "",
                  },
                },
              },
            },
          },
        },
      },
    },
    connector_type: "CONNECTOR_TYPE_BLOCKCHAIN",
    tombstone: false,
    public: true,
    custom: false,
    icon_url: "",
    vendor: "numbers",
    vendor_attributes: {},
  },
};
