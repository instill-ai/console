import { Pipeline } from "./types";

export const mockPipelines: Pipeline[] = [
  {
    name: "pipelines/text-pipeline",
    uid: "4ed56dad-9ff7-494f-8b6e-2c47cd24cd20",
    id: "text-pipeline",
    description: "",
    mode: "MODE_SYNC",
    state: "STATE_ACTIVE",
    user: "users/b5ad4b82-b126-4aa9-b0e0-6c172f313433",
    org: "",
    create_time: "2022-05-25T02:13:54.641028Z",
    update_time: "2022-05-25T02:13:54.641028Z",
    recipe: {
      source: {
        name: "source-connectors/source-grpc",
        uid: "256491c3-1f66-402e-abd9-b70143d93f08",
        id: "source-grpc",
        source_connector_definition: {
          name: "source-connector-definitions/source-grpc",
          uid: "82ca7d29-a35c-4222-b900-8d6878195e7a",
          id: "source-grpc",
          connector_definition: {
            title: "gRPC",
            docker_repository: "instill-ai/source-grpc",
            docker_image_tag: "directness",
            documentation_url:
              "https://docs.instill.tech/connectors/definitions/source-grpc-directness",
            icon: "grpc.svg",
            connection_type: "CONNECTION_TYPE_DIRECTNESS",
            spec: {
              documentation_url:
                "https://docs.instill.tech/connectors/definitions/source-grpc-directness",
              connection_specification: {
                $schema: "http://json-schema.org/draft-07/schema#",
                additionalProperties: false,
                properties: {},
                required: [],
                title: "Directness gRPC Source Connector Spec",
                type: "object",
              },
              supports_incremental: false,
              supports_normalization: false,
              supports_dbt: false,
              supported_destination_sync_modes: [],
              advanced_auth: null,
            },
            tombstone: false,
            public: true,
            custom: false,
            release_stage: "RELEASE_STAGE_UNSPECIFIED",
            release_date: {
              year: 0,
              month: 0,
              day: 0,
            },
            resource_requirements: {},
            create_time: "2022-05-24T09:01:20.274503Z",
            update_time: "2022-05-24T09:01:20.274503Z",
          },
        },
        connector: {
          description: "",
          configuration: {},
          tombstone: false,
          user: "users/local-user",
          create_time: "2022-05-25T02:12:39.644778Z",
          update_time: "2022-05-25T02:12:39.644778Z",
          org: "",
          state: "STATE_CONNECTED",
        },
      },
      destination: {
        name: "destination-connectors/destination-grpc",
        uid: "4e668b51-f77e-43b5-8948-55c4eb200cd8",
        id: "destination-grpc",
        destination_connector_definition: {
          name: "destination-connector-definitions/destination-grpc",
          uid: "c0e4a82c-9620-4a72-abd1-18586f2acccd",
          id: "destination-grpc",
          connector_definition: {
            title: "gRPC",
            docker_repository: "instill-ai/destination-grpc",
            docker_image_tag: "directness",
            documentation_url:
              "https://docs.instill.tech/connectors/definitions/destination-grpc-directness",
            icon: "grpc.svg",
            connection_type: "CONNECTION_TYPE_DIRECTNESS",
            spec: {
              documentation_url:
                "https://docs.instill.tech/connectors/definitions/destination-grpc-directness",
              connection_specification: {
                $schema: "http://json-schema.org/draft-07/schema#",
                additionalProperties: false,
                properties: {},
                required: [],
                title: "Directness gRPC Destination Connector Spec",
                type: "object",
              },
              supports_incremental: false,
              supports_normalization: false,
              supports_dbt: false,
              supported_destination_sync_modes: [],
              advanced_auth: null,
            },
            tombstone: false,
            public: true,
            custom: false,
            release_stage: "RELEASE_STAGE_UNSPECIFIED",
            release_date: {
              year: 0,
              month: 0,
              day: 0,
            },
            resource_requirements: {},
            create_time: "2022-05-24T09:01:20.277774Z",
            update_time: "2022-05-24T09:01:20.277774Z",
          },
        },
        connector: {
          description: "",
          configuration: {},
          tombstone: false,
          user: "users/local-user",
          create_time: "2022-05-25T02:13:45.383123Z",
          update_time: "2022-05-25T02:13:45.383123Z",
          org: "",
          state: "STATE_CONNECTED",
        },
      },
      models: [
        {
          name: "models/github-pochun/instances/v1.0-cpu",
          uid: "bb484ced-72a1-462b-b956-6d150db886a1",
          id: "v1.0-cpu",
          state: "STATE_ONLINE",
          task: "TASK_CLASSIFICATION",
          model_definition: "model-definitions/github",
          configuration: {},
          create_time: "2022-05-25T02:13:19.266799Z",
          update_time: "2022-05-25T02:13:41.557573Z",
        },
        {
          name: "models/github-pochun/instances/v1.0-gpu",
          uid: "bb484ced-72a1-462b-b956-6d150db886a1",
          id: "v1.0-cpu",
          state: "STATE_ONLINE",
          task: "TASK_CLASSIFICATION",
          model_definition: "model-definitions/github",
          configuration: {},
          create_time: "2022-05-25T02:13:19.266799Z",
          update_time: "2022-05-25T02:13:41.557573Z",
        },
      ],
    },
  },
];
