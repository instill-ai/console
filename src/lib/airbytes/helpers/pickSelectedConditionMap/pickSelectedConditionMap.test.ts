import { pickSelectedConditionMap } from "./pickSelectedConditionMap";
import { AirbyteFormTree } from "../../types";

test("should find one selected condition map", () => {
  const formTree: AirbyteFormTree = {
    title: "Snowflake Destination Spec",
    _type: "formGroup",
    jsonSchema: {
      $schema: "http://json-schema.org/draft-07/schema#",
      additionalProperties: true,
      properties: {
        credentials: {
          description: "",
          oneOf: [
            {
              properties: {
                access_token: {
                  description: "Enter you application's Access Token",
                  title: "Access Token",
                  type: "string",
                },
                auth_type: {
                  const: "OAuth2.0",
                  default: "OAuth2.0",
                  enum: ["OAuth2.0"],
                  type: "string",
                },
                client_id: {
                  description: "Enter your application's Client ID",
                  title: "Client ID",
                  type: "string",
                },
                client_secret: {
                  description: "Enter your application's Client secret",
                  title: "Client Secret",
                  type: "string",
                },
                refresh_token: {
                  description: "Enter your application's Refresh Token",
                  title: "Refresh Token",
                  type: "string",
                },
              },
              required: ["access_token", "refresh_token"],
              title: "OAuth2.0",
              type: "object",
            },
            {
              properties: {
                password: {
                  description:
                    "Enter the password associated with the username.",
                  title: "Password",
                  type: "string",
                },
              },
              required: ["password"],
              title: "Username and Password",
              type: "object",
            },
          ],
          order: 6,
          title: "Authorization Method",
          type: "object",
        },
        loading_method: {
          description: "Select a data staging method",
          oneOf: [
            {
              description: "Select another option",
              properties: {
                method: {
                  default: "Standard",
                  description: "",
                  enum: ["Standard"],
                  title: "",
                  type: "string",
                },
              },
              required: ["method"],
              title: "Select another option",
            },
            {
              description:
                "Recommended for large production workloads for better speed and scalability.",
              properties: {
                method: {
                  default: "Internal Staging",
                  description: "",
                  enum: ["Internal Staging"],
                  title: "",
                  type: "string",
                },
              },
              required: ["method"],
              title: "[Recommended] Internal Staging",
            },
            {
              description:
                "Recommended for large production workloads for better speed and scalability.",
              properties: {
                access_key_id: {
                  description:
                    'Enter your <a href="https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html">AWS access key ID</a>. Airbyte requires Read and Write permissions on your S3 bucket ',
                  title: "AWS access key ID",
                  type: "string",
                },
                encryption: {
                  default: {
                    encryption_type: "none",
                  },
                  description:
                    "Choose a data encryption method for the staging data",
                  oneOf: [
                    {
                      description: "Staging data will be stored in plaintext.",
                      properties: {
                        encryption_type: {
                          const: "none",
                          default: "none",
                          enum: ["none"],
                          type: "string",
                        },
                      },
                      required: ["encryption_type"],
                      title: "No encryption",
                      type: "object",
                    },
                    {
                      description:
                        "Staging data will be encrypted using AES-CBC envelope encryption.",
                      properties: {
                        encryption_type: {
                          const: "aes_cbc_envelope",
                          default: "aes_cbc_envelope",
                          enum: ["aes_cbc_envelope"],
                          type: "string",
                        },
                        key_encrypting_key: {
                          description:
                            "The key, base64-encoded. Must be either 128, 192, or 256 bits. Leave blank to have Airbyte generate an ephemeral key for each sync.",
                          title: "Key",
                          type: "string",
                        },
                      },
                      required: ["encryption_type"],
                      title: "AES-CBC envelope encryption",
                      type: "object",
                    },
                  ],
                  title: "Encryption",
                  type: "object",
                },
                file_name_pattern: {
                  description:
                    "The pattern allows you to set the file-name format for the S3 staging file(s)",
                  examples: [
                    "{date}",
                    "{date:yyyy_MM}",
                    "{timestamp}",
                    "{part_number}",
                    "{sync_id}",
                  ],
                  title: "S3 Filename pattern (Optional)",
                  type: "string",
                },
                method: {
                  default: "S3 Staging",
                  description: "",
                  enum: ["S3 Staging"],
                  title: "",
                  type: "string",
                },
                purge_staging_data: {
                  default: true,
                  description:
                    "Toggle to delete staging files from the S3 bucket after a successful sync",
                  title: "Purge Staging Files and Tables",
                  type: "boolean",
                },
                s3_bucket_name: {
                  description: "Enter your S3 bucket name",
                  examples: ["airbyte.staging"],
                  title: "S3 Bucket Name",
                  type: "string",
                },
                s3_bucket_region: {
                  default: "",
                  description: "Enter the region where your S3 bucket resides",
                  enum: [
                    "",
                    "us-east-1",
                    "us-east-2",
                    "us-west-1",
                    "us-west-2",
                    "af-south-1",
                    "ap-east-1",
                    "ap-south-1",
                    "ap-northeast-1",
                    "ap-northeast-2",
                    "ap-northeast-3",
                    "ap-southeast-1",
                    "ap-southeast-2",
                    "ca-central-1",
                    "cn-north-1",
                    "cn-northwest-1",
                    "eu-central-1",
                    "eu-west-1",
                    "eu-west-2",
                    "eu-west-3",
                    "eu-south-1",
                    "eu-north-1",
                    "sa-east-1",
                    "me-south-1",
                  ],
                  title: "S3 Bucket Region",
                  type: "string",
                },
                secret_access_key: {
                  description:
                    'Enter your <a href="https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html">AWS secret access key</a>',
                  title: "AWS secret access key",
                  type: "string",
                },
              },
              required: [
                "method",
                "s3_bucket_name",
                "access_key_id",
                "secret_access_key",
              ],
              title: "AWS S3 Staging",
            },
            {
              description:
                "Recommended for large production workloads for better speed and scalability.",
              properties: {
                bucket_name: {
                  description:
                    'Enter the <a href="https://cloud.google.com/storage/docs/creating-buckets">Cloud Storage bucket name</a>',
                  examples: ["airbyte-staging"],
                  title: "Cloud Storage bucket name",
                  type: "string",
                },
                credentials_json: {
                  description:
                    'Enter your <a href="https://cloud.google.com/iam/docs/creating-managing-service-account-keys#creating_service_account_keys">Google Cloud service account key</a> in the JSON format with read/write access to your Cloud Storage staging bucket',
                  title: "Google Application Credentials",
                  type: "string",
                },
                method: {
                  default: "GCS Staging",
                  description: "",
                  enum: ["GCS Staging"],
                  title: "",
                  type: "string",
                },
                project_id: {
                  description:
                    'Enter the <a href="https://cloud.google.com/resource-manager/docs/creating-managing-projects#identifying_projects">Google Cloud project ID</a>',
                  examples: ["my-project"],
                  title: "Google Cloud project ID",
                  type: "string",
                },
              },
              required: [
                "method",
                "project_id",
                "bucket_name",
                "credentials_json",
              ],
              title: "Google Cloud Storage Staging",
            },
            {
              description:
                "Recommended for large production workloads for better speed and scalability.",
              properties: {
                azure_blob_storage_account_name: {
                  description: "Enter your Azure Blob Storage account name",
                  examples: ["airbyte5storage"],
                  title:
                    'Azure Blob Storage <a href="https://docs.microsoft.com/en-us/azure/storage/common/storage-account-overview#storage-account-endpoints">account name</a>',
                  type: "string",
                },
                azure_blob_storage_container_name: {
                  description:
                    'Enter your Azure Blob Storage <a href="https://docs.microsoft.com/en-us/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#container-names">container name</a>',
                  examples: ["airbytetestcontainername"],
                  title: "Azure Blob Storage Container Name",
                  type: "string",
                },
                azure_blob_storage_endpoint_domain_name: {
                  default: "blob.core.windows.net",
                  description:
                    'Enter the Azure Blob Storage <a href="https://docs.microsoft.com/en-us/azure/storage/common/storage-account-overview#storage-account-endpoints">endpoint domain name</a>',
                  examples: ["blob.core.windows.net"],
                  title: "Azure Blob Storage Endpoint",
                  type: "string",
                },
                azure_blob_storage_sas_token: {
                  description:
                    'Enter the <a href="https://docs.snowflake.com/en/user-guide/data-load-azure-config.html#option-2-generating-a-sas-token">Shared access signature</a> (SAS) token to grant Snowflake limited access to objects in your Azure Blob Storage account',
                  examples: [
                    "?sv=2016-05-31&ss=b&srt=sco&sp=rwdl&se=2018-06-27T10:05:50Z&st=2017-06-27T02:05:50Z&spr=https,http&sig=bgqQwoXwxzuD2GJfagRg7VOS8hzNr3QLT7rhS8OFRLQ%3D",
                  ],
                  title: "SAS Token",
                  type: "string",
                },
                method: {
                  default: "Azure Blob Staging",
                  description: "",
                  enum: ["Azure Blob Staging"],
                  title: "",
                  type: "string",
                },
              },
              required: [
                "method",
                "azure_blob_storage_account_name",
                "azure_blob_storage_container_name",
                "azure_blob_storage_sas_token",
              ],
              title: "Azure Blob Storage Staging",
            },
          ],
          order: 8,
          title: "Data Staging Method",
          type: "object",
        },
        username: {
          description:
            "Enter the name of the user you want to use to access the database",
          examples: ["AIRBYTE_USER"],
          order: 5,
          title: "Username",
          type: "string",
        },
      },
      required: ["username"],
      title: "Snowflake Destination Spec",
      type: "object",
    },
    properties: [
      {
        description:
          "Enter the name of the user you want to use to access the database",
        examples: ["AIRBYTE_USER"],
        order: 5,
        title: "Username",
        _type: "formItem",
        path: "username",
        fieldKey: "username",
        isRequired: true,
        isSecret: false,
        multiline: false,
        type: "string",
      },
      {
        description: "",
        order: 6,
        title: "Authorization Method",
        _type: "formCondition",
        path: "credentials",
        fieldKey: "credentials",
        conditions: {
          "OAuth2.0": {
            order: 0,
            title: "OAuth2.0",
            _type: "formGroup",
            jsonSchema: {
              order: 0,
              properties: {
                access_token: {
                  airbyte_secret: true,
                  description: "Enter you application's Access Token",
                  title: "Access Token",
                  type: "string",
                },
                auth_type: {
                  const: "OAuth2.0",
                  default: "OAuth2.0",
                  enum: ["OAuth2.0"],
                  order: 0,
                  type: "string",
                },
                client_id: {
                  airbyte_secret: true,
                  description: "Enter your application's Client ID",
                  title: "Client ID",
                  type: "string",
                },
                client_secret: {
                  airbyte_secret: true,
                  description: "Enter your application's Client secret",
                  title: "Client Secret",
                  type: "string",
                },
                refresh_token: {
                  airbyte_secret: true,
                  description: "Enter your application's Refresh Token",
                  title: "Refresh Token",
                  type: "string",
                },
              },
              required: ["access_token", "refresh_token"],
              title: "OAuth2.0",
              type: "object",
            },
            path: "credentials",
            fieldKey: "credentials",
            properties: [
              {
                const: "OAuth2.0",
                default: "OAuth2.0",
                order: 0,
                _type: "formItem",
                path: "credentials.auth_type",
                fieldKey: "auth_type",
                isRequired: false,
                isSecret: false,
                multiline: false,
                type: "string",
              },
              {
                description: "Enter you application's Access Token",
                title: "Access Token",
                _type: "formItem",
                path: "credentials.access_token",
                fieldKey: "access_token",
                isRequired: true,
                isSecret: true,
                multiline: false,
                type: "string",
              },
              {
                description: "Enter your application's Client ID",
                title: "Client ID",
                _type: "formItem",
                path: "credentials.client_id",
                fieldKey: "client_id",
                isRequired: false,
                isSecret: true,
                multiline: false,
                type: "string",
              },
              {
                description: "Enter your application's Client secret",
                title: "Client Secret",
                _type: "formItem",
                path: "credentials.client_secret",
                fieldKey: "client_secret",
                isRequired: false,
                isSecret: true,
                multiline: false,
                type: "string",
              },
              {
                description: "Enter your application's Refresh Token",
                title: "Refresh Token",
                _type: "formItem",
                path: "credentials.refresh_token",
                fieldKey: "refresh_token",
                isRequired: true,
                isSecret: true,
                multiline: false,
                type: "string",
              },
            ],
            isRequired: false,
          },
          "Username and Password": {
            order: 1,
            title: "Username and Password",
            _type: "formGroup",
            jsonSchema: {
              order: 1,
              properties: {
                password: {
                  airbyte_secret: true,
                  description:
                    "Enter the password associated with the username.",
                  order: 1,
                  title: "Password",
                  type: "string",
                },
              },
              required: ["password"],
              title: "Username and Password",
              type: "object",
            },
            path: "credentials",
            fieldKey: "credentials",
            properties: [
              {
                description: "Enter the password associated with the username.",
                order: 1,
                title: "Password",
                _type: "formItem",
                path: "credentials.password",
                fieldKey: "password",
                isRequired: true,
                isSecret: true,
                multiline: false,
                type: "string",
              },
            ],
            isRequired: false,
          },
        },
        isRequired: false,
      },
      {
        description: "Select a data staging method",
        order: 8,
        title: "Data Staging Method",
        _type: "formCondition",
        path: "loading_method",
        fieldKey: "loading_method",
        conditions: {
          "Select another option": {
            description: "Select another option",
            title: "Select another option",
            _type: "formGroup",
            jsonSchema: {
              description: "Select another option",
              properties: {
                method: {
                  default: "Standard",
                  description: "",
                  enum: ["Standard"],
                  title: "",
                  type: "string",
                },
              },
              required: ["method"],
              title: "Select another option",
              type: "object",
            },
            path: "loading_method",
            fieldKey: "loading_method",
            properties: [
              {
                default: "Standard",
                description: "",
                title: "",
                const: "Standard",
                _type: "formItem",
                path: "loading_method.method",
                fieldKey: "method",
                isRequired: true,
                isSecret: false,
                multiline: false,
                type: "string",
              },
            ],
            isRequired: false,
          },
          "[Recommended] Internal Staging": {
            description:
              "Recommended for large production workloads for better speed and scalability.",
            title: "[Recommended] Internal Staging",
            _type: "formGroup",
            jsonSchema: {
              description:
                "Recommended for large production workloads for better speed and scalability.",
              properties: {
                method: {
                  default: "Internal Staging",
                  description: "",
                  enum: ["Internal Staging"],
                  title: "",
                  type: "string",
                },
              },
              required: ["method"],
              title: "[Recommended] Internal Staging",
              type: "object",
            },
            path: "loading_method",
            fieldKey: "loading_method",
            properties: [
              {
                default: "Internal Staging",
                description: "",
                title: "",
                const: "Internal Staging",
                _type: "formItem",
                path: "loading_method.method",
                fieldKey: "method",
                isRequired: true,
                isSecret: false,
                multiline: false,
                type: "string",
              },
            ],
            isRequired: false,
          },
          "AWS S3 Staging": {
            description:
              "Recommended for large production workloads for better speed and scalability.",
            title: "AWS S3 Staging",
            _type: "formGroup",
            jsonSchema: {
              description:
                "Recommended for large production workloads for better speed and scalability.",
              properties: {
                access_key_id: {
                  airbyte_secret: true,
                  description:
                    'Enter your <a href="https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html">AWS access key ID</a>. Airbyte requires Read and Write permissions on your S3 bucket ',
                  order: 3,
                  title: "AWS access key ID",
                  type: "string",
                },
                encryption: {
                  default: {
                    encryption_type: "none",
                  },
                  description:
                    "Choose a data encryption method for the staging data",
                  oneOf: [
                    {
                      description: "Staging data will be stored in plaintext.",
                      properties: {
                        encryption_type: {
                          const: "none",
                          default: "none",
                          enum: ["none"],
                          type: "string",
                        },
                      },
                      required: ["encryption_type"],
                      title: "No encryption",
                      type: "object",
                    },
                    {
                      description:
                        "Staging data will be encrypted using AES-CBC envelope encryption.",
                      properties: {
                        encryption_type: {
                          const: "aes_cbc_envelope",
                          default: "aes_cbc_envelope",
                          enum: ["aes_cbc_envelope"],
                          type: "string",
                        },
                        key_encrypting_key: {
                          description:
                            "The key, base64-encoded. Must be either 128, 192, or 256 bits. Leave blank to have Airbyte generate an ephemeral key for each sync.",
                          title: "Key",
                          type: "string",
                        },
                      },
                      required: ["encryption_type"],
                      title: "AES-CBC envelope encryption",
                      type: "object",
                    },
                  ],
                  order: 6,
                  title: "Encryption",
                  type: "object",
                },
                file_name_pattern: {
                  description:
                    "The pattern allows you to set the file-name format for the S3 staging file(s)",
                  examples: [
                    "{date}",
                    "{date:yyyy_MM}",
                    "{timestamp}",
                    "{part_number}",
                    "{sync_id}",
                  ],
                  order: 7,
                  title: "S3 Filename pattern (Optional)",
                  type: "string",
                },
                method: {
                  default: "S3 Staging",
                  description: "",
                  enum: ["S3 Staging"],
                  order: 0,
                  title: "",
                  type: "string",
                },
                purge_staging_data: {
                  default: true,
                  description:
                    "Toggle to delete staging files from the S3 bucket after a successful sync",
                  order: 5,
                  title: "Purge Staging Files and Tables",
                  type: "boolean",
                },
                s3_bucket_name: {
                  description: "Enter your S3 bucket name",
                  examples: ["airbyte.staging"],
                  order: 1,
                  title: "S3 Bucket Name",
                  type: "string",
                },
                s3_bucket_region: {
                  default: "",
                  description: "Enter the region where your S3 bucket resides",
                  enum: [
                    "",
                    "us-east-1",
                    "us-east-2",
                    "us-west-1",
                    "us-west-2",
                    "af-south-1",
                    "ap-east-1",
                    "ap-south-1",
                    "ap-northeast-1",
                    "ap-northeast-2",
                    "ap-northeast-3",
                    "ap-southeast-1",
                    "ap-southeast-2",
                    "ca-central-1",
                    "cn-north-1",
                    "cn-northwest-1",
                    "eu-central-1",
                    "eu-west-1",
                    "eu-west-2",
                    "eu-west-3",
                    "eu-south-1",
                    "eu-north-1",
                    "sa-east-1",
                    "me-south-1",
                  ],
                  order: 2,
                  title: "S3 Bucket Region",
                  type: "string",
                },
                secret_access_key: {
                  airbyte_secret: true,
                  description:
                    'Enter your <a href="https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html">AWS secret access key</a>',
                  order: 4,
                  title: "AWS secret access key",
                  type: "string",
                },
              },
              required: [
                "method",
                "s3_bucket_name",
                "access_key_id",
                "secret_access_key",
              ],
              title: "AWS S3 Staging",
              type: "object",
            },
            path: "loading_method",
            fieldKey: "loading_method",
            properties: [
              {
                default: "S3 Staging",
                description: "",
                order: 0,
                title: "",
                const: "S3 Staging",
                _type: "formItem",
                path: "loading_method.method",
                fieldKey: "method",
                isRequired: true,
                isSecret: false,
                multiline: false,
                type: "string",
              },
              {
                description: "Enter your S3 bucket name",
                examples: ["airbyte.staging"],
                order: 1,
                title: "S3 Bucket Name",
                _type: "formItem",
                path: "loading_method.s3_bucket_name",
                fieldKey: "s3_bucket_name",
                isRequired: true,
                isSecret: false,
                multiline: false,
                type: "string",
              },
              {
                default: "",
                description: "Enter the region where your S3 bucket resides",
                order: 2,
                title: "S3 Bucket Region",
                enum: [
                  "",
                  "us-east-1",
                  "us-east-2",
                  "us-west-1",
                  "us-west-2",
                  "af-south-1",
                  "ap-east-1",
                  "ap-south-1",
                  "ap-northeast-1",
                  "ap-northeast-2",
                  "ap-northeast-3",
                  "ap-southeast-1",
                  "ap-southeast-2",
                  "ca-central-1",
                  "cn-north-1",
                  "cn-northwest-1",
                  "eu-central-1",
                  "eu-west-1",
                  "eu-west-2",
                  "eu-west-3",
                  "eu-south-1",
                  "eu-north-1",
                  "sa-east-1",
                  "me-south-1",
                ],
                _type: "formItem",
                path: "loading_method.s3_bucket_region",
                fieldKey: "s3_bucket_region",
                isRequired: false,
                isSecret: false,
                multiline: false,
                type: "string",
              },
              {
                description:
                  'Enter your <a href="https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html">AWS access key ID</a>. Airbyte requires Read and Write permissions on your S3 bucket ',
                order: 3,
                title: "AWS access key ID",
                _type: "formItem",
                path: "loading_method.access_key_id",
                fieldKey: "access_key_id",
                isRequired: true,
                isSecret: true,
                multiline: false,
                type: "string",
              },
              {
                description:
                  'Enter your <a href="https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html">AWS secret access key</a>',
                order: 4,
                title: "AWS secret access key",
                _type: "formItem",
                path: "loading_method.secret_access_key",
                fieldKey: "secret_access_key",
                isRequired: true,
                isSecret: true,
                multiline: false,
                type: "string",
              },
              {
                default: true,
                description:
                  "Toggle to delete staging files from the S3 bucket after a successful sync",
                order: 5,
                title: "Purge Staging Files and Tables",
                _type: "formItem",
                path: "loading_method.purge_staging_data",
                fieldKey: "purge_staging_data",
                isRequired: false,
                isSecret: false,
                multiline: false,
                type: "boolean",
              },
              {
                description:
                  "Choose a data encryption method for the staging data",
                order: 6,
                title: "Encryption",
                _type: "formCondition",
                path: "loading_method.encryption",
                fieldKey: "encryption",
                conditions: {
                  "No encryption": {
                    description: "Staging data will be stored in plaintext.",
                    title: "No encryption",
                    _type: "formGroup",
                    jsonSchema: {
                      description: "Staging data will be stored in plaintext.",
                      properties: {
                        encryption_type: {
                          const: "none",
                          default: "none",
                          enum: ["none"],
                          type: "string",
                        },
                      },
                      required: ["encryption_type"],
                      title: "No encryption",
                      type: "object",
                    },
                    path: "loading_method.encryption",
                    fieldKey: "encryption",
                    properties: [
                      {
                        const: "none",
                        default: "none",
                        _type: "formItem",
                        path: "loading_method.encryption.encryption_type",
                        fieldKey: "encryption_type",
                        isRequired: true,
                        isSecret: false,
                        multiline: false,
                        type: "string",
                      },
                    ],
                    isRequired: false,
                  },
                  "AES-CBC envelope encryption": {
                    description:
                      "Staging data will be encrypted using AES-CBC envelope encryption.",
                    title: "AES-CBC envelope encryption",
                    _type: "formGroup",
                    jsonSchema: {
                      description:
                        "Staging data will be encrypted using AES-CBC envelope encryption.",
                      properties: {
                        encryption_type: {
                          const: "aes_cbc_envelope",
                          default: "aes_cbc_envelope",
                          enum: ["aes_cbc_envelope"],
                          type: "string",
                        },
                        key_encrypting_key: {
                          airbyte_secret: true,
                          description:
                            "The key, base64-encoded. Must be either 128, 192, or 256 bits. Leave blank to have Airbyte generate an ephemeral key for each sync.",
                          title: "Key",
                          type: "string",
                        },
                      },
                      required: ["encryption_type"],
                      title: "AES-CBC envelope encryption",
                      type: "object",
                    },
                    path: "loading_method.encryption",
                    fieldKey: "encryption",
                    properties: [
                      {
                        const: "aes_cbc_envelope",
                        default: "aes_cbc_envelope",
                        _type: "formItem",
                        path: "loading_method.encryption.encryption_type",
                        fieldKey: "encryption_type",
                        isRequired: true,
                        isSecret: false,
                        multiline: false,
                        type: "string",
                      },
                      {
                        description:
                          "The key, base64-encoded. Must be either 128, 192, or 256 bits. Leave blank to have Airbyte generate an ephemeral key for each sync.",
                        title: "Key",
                        _type: "formItem",
                        path: "loading_method.encryption.key_encrypting_key",
                        fieldKey: "key_encrypting_key",
                        isRequired: false,
                        isSecret: true,
                        multiline: false,
                        type: "string",
                      },
                    ],
                    isRequired: false,
                  },
                },
                isRequired: false,
              },
              {
                description:
                  "The pattern allows you to set the file-name format for the S3 staging file(s)",
                examples: [
                  "{date}",
                  "{date:yyyy_MM}",
                  "{timestamp}",
                  "{part_number}",
                  "{sync_id}",
                ],
                order: 7,
                title: "S3 Filename pattern (Optional)",
                _type: "formItem",
                path: "loading_method.file_name_pattern",
                fieldKey: "file_name_pattern",
                isRequired: false,
                isSecret: false,
                multiline: false,
                type: "string",
              },
            ],
            isRequired: false,
          },
          "Google Cloud Storage Staging": {
            description:
              "Recommended for large production workloads for better speed and scalability.",
            title: "Google Cloud Storage Staging",
            _type: "formGroup",
            jsonSchema: {
              description:
                "Recommended for large production workloads for better speed and scalability.",
              properties: {
                bucket_name: {
                  description:
                    'Enter the <a href="https://cloud.google.com/storage/docs/creating-buckets">Cloud Storage bucket name</a>',
                  examples: ["airbyte-staging"],
                  order: 2,
                  title: "Cloud Storage bucket name",
                  type: "string",
                },
                credentials_json: {
                  airbyte_secret: true,
                  description:
                    'Enter your <a href="https://cloud.google.com/iam/docs/creating-managing-service-account-keys#creating_service_account_keys">Google Cloud service account key</a> in the JSON format with read/write access to your Cloud Storage staging bucket',
                  multiline: true,
                  order: 3,
                  title: "Google Application Credentials",
                  type: "string",
                },
                method: {
                  default: "GCS Staging",
                  description: "",
                  enum: ["GCS Staging"],
                  order: 0,
                  title: "",
                  type: "string",
                },
                project_id: {
                  description:
                    'Enter the <a href="https://cloud.google.com/resource-manager/docs/creating-managing-projects#identifying_projects">Google Cloud project ID</a>',
                  examples: ["my-project"],
                  order: 1,
                  title: "Google Cloud project ID",
                  type: "string",
                },
              },
              required: [
                "method",
                "project_id",
                "bucket_name",
                "credentials_json",
              ],
              title: "Google Cloud Storage Staging",
              type: "object",
            },
            path: "loading_method",
            fieldKey: "loading_method",
            properties: [
              {
                default: "GCS Staging",
                description: "",
                order: 0,
                title: "",
                const: "GCS Staging",
                _type: "formItem",
                path: "loading_method.method",
                fieldKey: "method",
                isRequired: true,
                isSecret: false,
                multiline: false,
                type: "string",
              },
              {
                description:
                  'Enter the <a href="https://cloud.google.com/resource-manager/docs/creating-managing-projects#identifying_projects">Google Cloud project ID</a>',
                examples: ["my-project"],
                order: 1,
                title: "Google Cloud project ID",
                _type: "formItem",
                path: "loading_method.project_id",
                fieldKey: "project_id",
                isRequired: true,
                isSecret: false,
                multiline: false,
                type: "string",
              },
              {
                description:
                  'Enter the <a href="https://cloud.google.com/storage/docs/creating-buckets">Cloud Storage bucket name</a>',
                examples: ["airbyte-staging"],
                order: 2,
                title: "Cloud Storage bucket name",
                _type: "formItem",
                path: "loading_method.bucket_name",
                fieldKey: "bucket_name",
                isRequired: true,
                isSecret: false,
                multiline: false,
                type: "string",
              },
              {
                description:
                  'Enter your <a href="https://cloud.google.com/iam/docs/creating-managing-service-account-keys#creating_service_account_keys">Google Cloud service account key</a> in the JSON format with read/write access to your Cloud Storage staging bucket',
                order: 3,
                title: "Google Application Credentials",
                _type: "formItem",
                path: "loading_method.credentials_json",
                fieldKey: "credentials_json",
                isRequired: true,
                isSecret: true,
                multiline: true,
                type: "string",
              },
            ],
            isRequired: false,
          },
          "Azure Blob Storage Staging": {
            description:
              "Recommended for large production workloads for better speed and scalability.",
            title: "Azure Blob Storage Staging",
            _type: "formGroup",
            jsonSchema: {
              description:
                "Recommended for large production workloads for better speed and scalability.",
              properties: {
                azure_blob_storage_account_name: {
                  description: "Enter your Azure Blob Storage account name",
                  examples: ["airbyte5storage"],
                  order: 2,
                  title:
                    'Azure Blob Storage <a href="https://docs.microsoft.com/en-us/azure/storage/common/storage-account-overview#storage-account-endpoints">account name</a>',
                  type: "string",
                },
                azure_blob_storage_container_name: {
                  description:
                    'Enter your Azure Blob Storage <a href="https://docs.microsoft.com/en-us/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#container-names">container name</a>',
                  examples: ["airbytetestcontainername"],
                  order: 3,
                  title: "Azure Blob Storage Container Name",
                  type: "string",
                },
                azure_blob_storage_endpoint_domain_name: {
                  default: "blob.core.windows.net",
                  description:
                    'Enter the Azure Blob Storage <a href="https://docs.microsoft.com/en-us/azure/storage/common/storage-account-overview#storage-account-endpoints">endpoint domain name</a>',
                  examples: ["blob.core.windows.net"],
                  order: 1,
                  title: "Azure Blob Storage Endpoint",
                  type: "string",
                },
                azure_blob_storage_sas_token: {
                  airbyte_secret: true,
                  description:
                    'Enter the <a href="https://docs.snowflake.com/en/user-guide/data-load-azure-config.html#option-2-generating-a-sas-token">Shared access signature</a> (SAS) token to grant Snowflake limited access to objects in your Azure Blob Storage account',
                  examples: [
                    "?sv=2016-05-31&ss=b&srt=sco&sp=rwdl&se=2018-06-27T10:05:50Z&st=2017-06-27T02:05:50Z&spr=https,http&sig=bgqQwoXwxzuD2GJfagRg7VOS8hzNr3QLT7rhS8OFRLQ%3D",
                  ],
                  order: 4,
                  title: "SAS Token",
                  type: "string",
                },
                method: {
                  default: "Azure Blob Staging",
                  description: "",
                  enum: ["Azure Blob Staging"],
                  order: 0,
                  title: "",
                  type: "string",
                },
              },
              required: [
                "method",
                "azure_blob_storage_account_name",
                "azure_blob_storage_container_name",
                "azure_blob_storage_sas_token",
              ],
              title: "Azure Blob Storage Staging",
              type: "object",
            },
            path: "loading_method",
            fieldKey: "loading_method",
            properties: [
              {
                default: "Azure Blob Staging",
                description: "",
                order: 0,
                title: "",
                const: "Azure Blob Staging",
                _type: "formItem",
                path: "loading_method.method",
                fieldKey: "method",
                isRequired: true,
                isSecret: false,
                multiline: false,
                type: "string",
              },
              {
                default: "blob.core.windows.net",
                description:
                  'Enter the Azure Blob Storage <a href="https://docs.microsoft.com/en-us/azure/storage/common/storage-account-overview#storage-account-endpoints">endpoint domain name</a>',
                examples: ["blob.core.windows.net"],
                order: 1,
                title: "Azure Blob Storage Endpoint",
                _type: "formItem",
                path: "loading_method.azure_blob_storage_endpoint_domain_name",
                fieldKey: "azure_blob_storage_endpoint_domain_name",
                isRequired: false,
                isSecret: false,
                multiline: false,
                type: "string",
              },
              {
                description: "Enter your Azure Blob Storage account name",
                examples: ["airbyte5storage"],
                order: 2,
                title:
                  'Azure Blob Storage <a href="https://docs.microsoft.com/en-us/azure/storage/common/storage-account-overview#storage-account-endpoints">account name</a>',
                _type: "formItem",
                path: "loading_method.azure_blob_storage_account_name",
                fieldKey: "azure_blob_storage_account_name",
                isRequired: true,
                isSecret: false,
                multiline: false,
                type: "string",
              },
              {
                description:
                  'Enter your Azure Blob Storage <a href="https://docs.microsoft.com/en-us/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#container-names">container name</a>',
                examples: ["airbytetestcontainername"],
                order: 3,
                title: "Azure Blob Storage Container Name",
                _type: "formItem",
                path: "loading_method.azure_blob_storage_container_name",
                fieldKey: "azure_blob_storage_container_name",
                isRequired: true,
                isSecret: false,
                multiline: false,
                type: "string",
              },
              {
                description:
                  'Enter the <a href="https://docs.snowflake.com/en/user-guide/data-load-azure-config.html#option-2-generating-a-sas-token">Shared access signature</a> (SAS) token to grant Snowflake limited access to objects in your Azure Blob Storage account',
                examples: [
                  "?sv=2016-05-31&ss=b&srt=sco&sp=rwdl&se=2018-06-27T10:05:50Z&st=2017-06-27T02:05:50Z&spr=https,http&sig=bgqQwoXwxzuD2GJfagRg7VOS8hzNr3QLT7rhS8OFRLQ%3D",
                ],
                order: 4,
                title: "SAS Token",
                _type: "formItem",
                path: "loading_method.azure_blob_storage_sas_token",
                fieldKey: "azure_blob_storage_sas_token",
                isRequired: true,
                isSecret: true,
                multiline: false,
                type: "string",
              },
            ],
            isRequired: false,
          },
        },
        isRequired: false,
      },
    ],
    fieldKey: "",
    isRequired: false,
    path: "",
  };

  const initialValues = {
    "loading_method.method": "Internal Staging",
    configuration: {
      loading_method: {
        method: "Internal Staging",
      },
    },
  };

  const selectedConditionMap = pickSelectedConditionMap(
    formTree,
    initialValues
  );

  expect(selectedConditionMap).toEqual({
    loading_method: {
      selectedItem: "[Recommended] Internal Staging",
    },
  });
});

test("should find multiple selected condition map", () => {
  const formTree: AirbyteFormTree = {
    title: "Snowflake Destination Spec",
    _type: "formGroup",
    jsonSchema: {
      $schema: "http://json-schema.org/draft-07/schema#",
      additionalProperties: true,
      properties: {
        credentials: {
          description: "",
          oneOf: [
            {
              properties: {
                access_token: {
                  description: "Enter you application's Access Token",
                  title: "Access Token",
                  type: "string",
                },
                auth_type: {
                  const: "OAuth2.0",
                  default: "OAuth2.0",
                  enum: ["OAuth2.0"],
                  type: "string",
                },
                client_id: {
                  description: "Enter your application's Client ID",
                  title: "Client ID",
                  type: "string",
                },
                client_secret: {
                  description: "Enter your application's Client secret",
                  title: "Client Secret",
                  type: "string",
                },
                refresh_token: {
                  description: "Enter your application's Refresh Token",
                  title: "Refresh Token",
                  type: "string",
                },
              },
              required: ["access_token", "refresh_token"],
              title: "OAuth2.0",
              type: "object",
            },
            {
              properties: {
                password: {
                  description:
                    "Enter the password associated with the username.",
                  title: "Password",
                  type: "string",
                },
              },
              required: ["password"],
              title: "Username and Password",
              type: "object",
            },
          ],
          order: 6,
          title: "Authorization Method",
          type: "object",
        },
        loading_method: {
          description: "Select a data staging method",
          oneOf: [
            {
              description: "Select another option",
              properties: {
                method: {
                  default: "Standard",
                  description: "",
                  enum: ["Standard"],
                  title: "",
                  type: "string",
                },
              },
              required: ["method"],
              title: "Select another option",
            },
            {
              description:
                "Recommended for large production workloads for better speed and scalability.",
              properties: {
                method: {
                  default: "Internal Staging",
                  description: "",
                  enum: ["Internal Staging"],
                  title: "",
                  type: "string",
                },
              },
              required: ["method"],
              title: "[Recommended] Internal Staging",
            },
            {
              description:
                "Recommended for large production workloads for better speed and scalability.",
              properties: {
                access_key_id: {
                  description:
                    'Enter your <a href="https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html">AWS access key ID</a>. Airbyte requires Read and Write permissions on your S3 bucket ',
                  title: "AWS access key ID",
                  type: "string",
                },
                encryption: {
                  default: {
                    encryption_type: "none",
                  },
                  description:
                    "Choose a data encryption method for the staging data",
                  oneOf: [
                    {
                      description: "Staging data will be stored in plaintext.",
                      properties: {
                        encryption_type: {
                          const: "none",
                          default: "none",
                          enum: ["none"],
                          type: "string",
                        },
                      },
                      required: ["encryption_type"],
                      title: "No encryption",
                      type: "object",
                    },
                    {
                      description:
                        "Staging data will be encrypted using AES-CBC envelope encryption.",
                      properties: {
                        encryption_type: {
                          const: "aes_cbc_envelope",
                          default: "aes_cbc_envelope",
                          enum: ["aes_cbc_envelope"],
                          type: "string",
                        },
                        key_encrypting_key: {
                          description:
                            "The key, base64-encoded. Must be either 128, 192, or 256 bits. Leave blank to have Airbyte generate an ephemeral key for each sync.",
                          title: "Key",
                          type: "string",
                        },
                      },
                      required: ["encryption_type"],
                      title: "AES-CBC envelope encryption",
                      type: "object",
                    },
                  ],
                  title: "Encryption",
                  type: "object",
                },
                file_name_pattern: {
                  description:
                    "The pattern allows you to set the file-name format for the S3 staging file(s)",
                  examples: [
                    "{date}",
                    "{date:yyyy_MM}",
                    "{timestamp}",
                    "{part_number}",
                    "{sync_id}",
                  ],
                  title: "S3 Filename pattern (Optional)",
                  type: "string",
                },
                method: {
                  default: "S3 Staging",
                  description: "",
                  enum: ["S3 Staging"],
                  title: "",
                  type: "string",
                },
                purge_staging_data: {
                  default: true,
                  description:
                    "Toggle to delete staging files from the S3 bucket after a successful sync",
                  title: "Purge Staging Files and Tables",
                  type: "boolean",
                },
                s3_bucket_name: {
                  description: "Enter your S3 bucket name",
                  examples: ["airbyte.staging"],
                  title: "S3 Bucket Name",
                  type: "string",
                },
                s3_bucket_region: {
                  default: "",
                  description: "Enter the region where your S3 bucket resides",
                  enum: [
                    "",
                    "us-east-1",
                    "us-east-2",
                    "us-west-1",
                    "us-west-2",
                    "af-south-1",
                    "ap-east-1",
                    "ap-south-1",
                    "ap-northeast-1",
                    "ap-northeast-2",
                    "ap-northeast-3",
                    "ap-southeast-1",
                    "ap-southeast-2",
                    "ca-central-1",
                    "cn-north-1",
                    "cn-northwest-1",
                    "eu-central-1",
                    "eu-west-1",
                    "eu-west-2",
                    "eu-west-3",
                    "eu-south-1",
                    "eu-north-1",
                    "sa-east-1",
                    "me-south-1",
                  ],
                  title: "S3 Bucket Region",
                  type: "string",
                },
                secret_access_key: {
                  description:
                    'Enter your <a href="https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html">AWS secret access key</a>',
                  title: "AWS secret access key",
                  type: "string",
                },
              },
              required: [
                "method",
                "s3_bucket_name",
                "access_key_id",
                "secret_access_key",
              ],
              title: "AWS S3 Staging",
            },
            {
              description:
                "Recommended for large production workloads for better speed and scalability.",
              properties: {
                bucket_name: {
                  description:
                    'Enter the <a href="https://cloud.google.com/storage/docs/creating-buckets">Cloud Storage bucket name</a>',
                  examples: ["airbyte-staging"],
                  title: "Cloud Storage bucket name",
                  type: "string",
                },
                credentials_json: {
                  description:
                    'Enter your <a href="https://cloud.google.com/iam/docs/creating-managing-service-account-keys#creating_service_account_keys">Google Cloud service account key</a> in the JSON format with read/write access to your Cloud Storage staging bucket',
                  title: "Google Application Credentials",
                  type: "string",
                },
                method: {
                  default: "GCS Staging",
                  description: "",
                  enum: ["GCS Staging"],
                  title: "",
                  type: "string",
                },
                project_id: {
                  description:
                    'Enter the <a href="https://cloud.google.com/resource-manager/docs/creating-managing-projects#identifying_projects">Google Cloud project ID</a>',
                  examples: ["my-project"],
                  title: "Google Cloud project ID",
                  type: "string",
                },
              },
              required: [
                "method",
                "project_id",
                "bucket_name",
                "credentials_json",
              ],
              title: "Google Cloud Storage Staging",
            },
            {
              description:
                "Recommended for large production workloads for better speed and scalability.",
              properties: {
                azure_blob_storage_account_name: {
                  description: "Enter your Azure Blob Storage account name",
                  examples: ["airbyte5storage"],
                  title:
                    'Azure Blob Storage <a href="https://docs.microsoft.com/en-us/azure/storage/common/storage-account-overview#storage-account-endpoints">account name</a>',
                  type: "string",
                },
                azure_blob_storage_container_name: {
                  description:
                    'Enter your Azure Blob Storage <a href="https://docs.microsoft.com/en-us/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#container-names">container name</a>',
                  examples: ["airbytetestcontainername"],
                  title: "Azure Blob Storage Container Name",
                  type: "string",
                },
                azure_blob_storage_endpoint_domain_name: {
                  default: "blob.core.windows.net",
                  description:
                    'Enter the Azure Blob Storage <a href="https://docs.microsoft.com/en-us/azure/storage/common/storage-account-overview#storage-account-endpoints">endpoint domain name</a>',
                  examples: ["blob.core.windows.net"],
                  title: "Azure Blob Storage Endpoint",
                  type: "string",
                },
                azure_blob_storage_sas_token: {
                  description:
                    'Enter the <a href="https://docs.snowflake.com/en/user-guide/data-load-azure-config.html#option-2-generating-a-sas-token">Shared access signature</a> (SAS) token to grant Snowflake limited access to objects in your Azure Blob Storage account',
                  examples: [
                    "?sv=2016-05-31&ss=b&srt=sco&sp=rwdl&se=2018-06-27T10:05:50Z&st=2017-06-27T02:05:50Z&spr=https,http&sig=bgqQwoXwxzuD2GJfagRg7VOS8hzNr3QLT7rhS8OFRLQ%3D",
                  ],
                  title: "SAS Token",
                  type: "string",
                },
                method: {
                  default: "Azure Blob Staging",
                  description: "",
                  enum: ["Azure Blob Staging"],
                  title: "",
                  type: "string",
                },
              },
              required: [
                "method",
                "azure_blob_storage_account_name",
                "azure_blob_storage_container_name",
                "azure_blob_storage_sas_token",
              ],
              title: "Azure Blob Storage Staging",
            },
          ],
          order: 8,
          title: "Data Staging Method",
          type: "object",
        },
        username: {
          description:
            "Enter the name of the user you want to use to access the database",
          examples: ["AIRBYTE_USER"],
          order: 5,
          title: "Username",
          type: "string",
        },
      },
      required: ["username"],
      title: "Snowflake Destination Spec",
      type: "object",
    },
    properties: [
      {
        description:
          "Enter the name of the user you want to use to access the database",
        examples: ["AIRBYTE_USER"],
        order: 5,
        title: "Username",
        _type: "formItem",
        path: "username",
        fieldKey: "username",
        isRequired: true,
        isSecret: false,
        multiline: false,
        type: "string",
      },
      {
        description: "",
        order: 6,
        title: "Authorization Method",
        _type: "formCondition",
        path: "credentials",
        fieldKey: "credentials",
        conditions: {
          "OAuth2.0": {
            order: 0,
            title: "OAuth2.0",
            _type: "formGroup",
            jsonSchema: {
              order: 0,
              properties: {
                access_token: {
                  airbyte_secret: true,
                  description: "Enter you application's Access Token",
                  title: "Access Token",
                  type: "string",
                },
                auth_type: {
                  const: "OAuth2.0",
                  default: "OAuth2.0",
                  enum: ["OAuth2.0"],
                  order: 0,
                  type: "string",
                },
                client_id: {
                  airbyte_secret: true,
                  description: "Enter your application's Client ID",
                  title: "Client ID",
                  type: "string",
                },
                client_secret: {
                  airbyte_secret: true,
                  description: "Enter your application's Client secret",
                  title: "Client Secret",
                  type: "string",
                },
                refresh_token: {
                  airbyte_secret: true,
                  description: "Enter your application's Refresh Token",
                  title: "Refresh Token",
                  type: "string",
                },
              },
              required: ["access_token", "refresh_token"],
              title: "OAuth2.0",
              type: "object",
            },
            path: "credentials",
            fieldKey: "credentials",
            properties: [
              {
                const: "OAuth2.0",
                default: "OAuth2.0",
                order: 0,
                _type: "formItem",
                path: "credentials.auth_type",
                fieldKey: "auth_type",
                isRequired: false,
                isSecret: false,
                multiline: false,
                type: "string",
              },
              {
                description: "Enter you application's Access Token",
                title: "Access Token",
                _type: "formItem",
                path: "credentials.access_token",
                fieldKey: "access_token",
                isRequired: true,
                isSecret: true,
                multiline: false,
                type: "string",
              },
              {
                description: "Enter your application's Client ID",
                title: "Client ID",
                _type: "formItem",
                path: "credentials.client_id",
                fieldKey: "client_id",
                isRequired: false,
                isSecret: true,
                multiline: false,
                type: "string",
              },
              {
                description: "Enter your application's Client secret",
                title: "Client Secret",
                _type: "formItem",
                path: "credentials.client_secret",
                fieldKey: "client_secret",
                isRequired: false,
                isSecret: true,
                multiline: false,
                type: "string",
              },
              {
                description: "Enter your application's Refresh Token",
                title: "Refresh Token",
                _type: "formItem",
                path: "credentials.refresh_token",
                fieldKey: "refresh_token",
                isRequired: true,
                isSecret: true,
                multiline: false,
                type: "string",
              },
            ],
            isRequired: false,
          },
          "Username and Password": {
            order: 1,
            title: "Username and Password",
            _type: "formGroup",
            jsonSchema: {
              order: 1,
              properties: {
                password: {
                  airbyte_secret: true,
                  description:
                    "Enter the password associated with the username.",
                  order: 1,
                  title: "Password",
                  type: "string",
                },
              },
              required: ["password"],
              title: "Username and Password",
              type: "object",
            },
            path: "credentials",
            fieldKey: "credentials",
            properties: [
              {
                description: "Enter the password associated with the username.",
                order: 1,
                title: "Password",
                _type: "formItem",
                path: "credentials.password",
                fieldKey: "password",
                isRequired: true,
                isSecret: true,
                multiline: false,
                type: "string",
              },
            ],
            isRequired: false,
          },
        },
        isRequired: false,
      },
      {
        description: "Select a data staging method",
        order: 8,
        title: "Data Staging Method",
        _type: "formCondition",
        path: "loading_method",
        fieldKey: "loading_method",
        conditions: {
          "Select another option": {
            description: "Select another option",
            title: "Select another option",
            _type: "formGroup",
            jsonSchema: {
              description: "Select another option",
              properties: {
                method: {
                  default: "Standard",
                  description: "",
                  enum: ["Standard"],
                  title: "",
                  type: "string",
                },
              },
              required: ["method"],
              title: "Select another option",
              type: "object",
            },
            path: "loading_method",
            fieldKey: "loading_method",
            properties: [
              {
                default: "Standard",
                description: "",
                title: "",
                const: "Standard",
                _type: "formItem",
                path: "loading_method.method",
                fieldKey: "method",
                isRequired: true,
                isSecret: false,
                multiline: false,
                type: "string",
              },
            ],
            isRequired: false,
          },
          "[Recommended] Internal Staging": {
            description:
              "Recommended for large production workloads for better speed and scalability.",
            title: "[Recommended] Internal Staging",
            _type: "formGroup",
            jsonSchema: {
              description:
                "Recommended for large production workloads for better speed and scalability.",
              properties: {
                method: {
                  default: "Internal Staging",
                  description: "",
                  enum: ["Internal Staging"],
                  title: "",
                  type: "string",
                },
              },
              required: ["method"],
              title: "[Recommended] Internal Staging",
              type: "object",
            },
            path: "loading_method",
            fieldKey: "loading_method",
            properties: [
              {
                default: "Internal Staging",
                description: "",
                title: "",
                const: "Internal Staging",
                _type: "formItem",
                path: "loading_method.method",
                fieldKey: "method",
                isRequired: true,
                isSecret: false,
                multiline: false,
                type: "string",
              },
            ],
            isRequired: false,
          },
          "AWS S3 Staging": {
            description:
              "Recommended for large production workloads for better speed and scalability.",
            title: "AWS S3 Staging",
            _type: "formGroup",
            jsonSchema: {
              description:
                "Recommended for large production workloads for better speed and scalability.",
              properties: {
                access_key_id: {
                  airbyte_secret: true,
                  description:
                    'Enter your <a href="https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html">AWS access key ID</a>. Airbyte requires Read and Write permissions on your S3 bucket ',
                  order: 3,
                  title: "AWS access key ID",
                  type: "string",
                },
                encryption: {
                  default: {
                    encryption_type: "none",
                  },
                  description:
                    "Choose a data encryption method for the staging data",
                  oneOf: [
                    {
                      description: "Staging data will be stored in plaintext.",
                      properties: {
                        encryption_type: {
                          const: "none",
                          default: "none",
                          enum: ["none"],
                          type: "string",
                        },
                      },
                      required: ["encryption_type"],
                      title: "No encryption",
                      type: "object",
                    },
                    {
                      description:
                        "Staging data will be encrypted using AES-CBC envelope encryption.",
                      properties: {
                        encryption_type: {
                          const: "aes_cbc_envelope",
                          default: "aes_cbc_envelope",
                          enum: ["aes_cbc_envelope"],
                          type: "string",
                        },
                        key_encrypting_key: {
                          description:
                            "The key, base64-encoded. Must be either 128, 192, or 256 bits. Leave blank to have Airbyte generate an ephemeral key for each sync.",
                          title: "Key",
                          type: "string",
                        },
                      },
                      required: ["encryption_type"],
                      title: "AES-CBC envelope encryption",
                      type: "object",
                    },
                  ],
                  order: 6,
                  title: "Encryption",
                  type: "object",
                },
                file_name_pattern: {
                  description:
                    "The pattern allows you to set the file-name format for the S3 staging file(s)",
                  examples: [
                    "{date}",
                    "{date:yyyy_MM}",
                    "{timestamp}",
                    "{part_number}",
                    "{sync_id}",
                  ],
                  order: 7,
                  title: "S3 Filename pattern (Optional)",
                  type: "string",
                },
                method: {
                  default: "S3 Staging",
                  description: "",
                  enum: ["S3 Staging"],
                  order: 0,
                  title: "",
                  type: "string",
                },
                purge_staging_data: {
                  default: true,
                  description:
                    "Toggle to delete staging files from the S3 bucket after a successful sync",
                  order: 5,
                  title: "Purge Staging Files and Tables",
                  type: "boolean",
                },
                s3_bucket_name: {
                  description: "Enter your S3 bucket name",
                  examples: ["airbyte.staging"],
                  order: 1,
                  title: "S3 Bucket Name",
                  type: "string",
                },
                s3_bucket_region: {
                  default: "",
                  description: "Enter the region where your S3 bucket resides",
                  enum: [
                    "",
                    "us-east-1",
                    "us-east-2",
                    "us-west-1",
                    "us-west-2",
                    "af-south-1",
                    "ap-east-1",
                    "ap-south-1",
                    "ap-northeast-1",
                    "ap-northeast-2",
                    "ap-northeast-3",
                    "ap-southeast-1",
                    "ap-southeast-2",
                    "ca-central-1",
                    "cn-north-1",
                    "cn-northwest-1",
                    "eu-central-1",
                    "eu-west-1",
                    "eu-west-2",
                    "eu-west-3",
                    "eu-south-1",
                    "eu-north-1",
                    "sa-east-1",
                    "me-south-1",
                  ],
                  order: 2,
                  title: "S3 Bucket Region",
                  type: "string",
                },
                secret_access_key: {
                  airbyte_secret: true,
                  description:
                    'Enter your <a href="https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html">AWS secret access key</a>',
                  order: 4,
                  title: "AWS secret access key",
                  type: "string",
                },
              },
              required: [
                "method",
                "s3_bucket_name",
                "access_key_id",
                "secret_access_key",
              ],
              title: "AWS S3 Staging",
              type: "object",
            },
            path: "loading_method",
            fieldKey: "loading_method",
            properties: [
              {
                default: "S3 Staging",
                description: "",
                order: 0,
                title: "",
                const: "S3 Staging",
                _type: "formItem",
                path: "loading_method.method",
                fieldKey: "method",
                isRequired: true,
                isSecret: false,
                multiline: false,
                type: "string",
              },
              {
                description: "Enter your S3 bucket name",
                examples: ["airbyte.staging"],
                order: 1,
                title: "S3 Bucket Name",
                _type: "formItem",
                path: "loading_method.s3_bucket_name",
                fieldKey: "s3_bucket_name",
                isRequired: true,
                isSecret: false,
                multiline: false,
                type: "string",
              },
              {
                default: "",
                description: "Enter the region where your S3 bucket resides",
                order: 2,
                title: "S3 Bucket Region",
                enum: [
                  "",
                  "us-east-1",
                  "us-east-2",
                  "us-west-1",
                  "us-west-2",
                  "af-south-1",
                  "ap-east-1",
                  "ap-south-1",
                  "ap-northeast-1",
                  "ap-northeast-2",
                  "ap-northeast-3",
                  "ap-southeast-1",
                  "ap-southeast-2",
                  "ca-central-1",
                  "cn-north-1",
                  "cn-northwest-1",
                  "eu-central-1",
                  "eu-west-1",
                  "eu-west-2",
                  "eu-west-3",
                  "eu-south-1",
                  "eu-north-1",
                  "sa-east-1",
                  "me-south-1",
                ],
                _type: "formItem",
                path: "loading_method.s3_bucket_region",
                fieldKey: "s3_bucket_region",
                isRequired: false,
                isSecret: false,
                multiline: false,
                type: "string",
              },
              {
                description:
                  'Enter your <a href="https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html">AWS access key ID</a>. Airbyte requires Read and Write permissions on your S3 bucket ',
                order: 3,
                title: "AWS access key ID",
                _type: "formItem",
                path: "loading_method.access_key_id",
                fieldKey: "access_key_id",
                isRequired: true,
                isSecret: true,
                multiline: false,
                type: "string",
              },
              {
                description:
                  'Enter your <a href="https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html">AWS secret access key</a>',
                order: 4,
                title: "AWS secret access key",
                _type: "formItem",
                path: "loading_method.secret_access_key",
                fieldKey: "secret_access_key",
                isRequired: true,
                isSecret: true,
                multiline: false,
                type: "string",
              },
              {
                default: true,
                description:
                  "Toggle to delete staging files from the S3 bucket after a successful sync",
                order: 5,
                title: "Purge Staging Files and Tables",
                _type: "formItem",
                path: "loading_method.purge_staging_data",
                fieldKey: "purge_staging_data",
                isRequired: false,
                isSecret: false,
                multiline: false,
                type: "boolean",
              },
              {
                description:
                  "Choose a data encryption method for the staging data",
                order: 6,
                title: "Encryption",
                _type: "formCondition",
                path: "loading_method.encryption",
                fieldKey: "encryption",
                conditions: {
                  "No encryption": {
                    description: "Staging data will be stored in plaintext.",
                    title: "No encryption",
                    _type: "formGroup",
                    jsonSchema: {
                      description: "Staging data will be stored in plaintext.",
                      properties: {
                        encryption_type: {
                          const: "none",
                          default: "none",
                          enum: ["none"],
                          type: "string",
                        },
                      },
                      required: ["encryption_type"],
                      title: "No encryption",
                      type: "object",
                    },
                    path: "loading_method.encryption",
                    fieldKey: "encryption",
                    properties: [
                      {
                        const: "none",
                        default: "none",
                        _type: "formItem",
                        path: "loading_method.encryption.encryption_type",
                        fieldKey: "encryption_type",
                        isRequired: true,
                        isSecret: false,
                        multiline: false,
                        type: "string",
                      },
                    ],
                    isRequired: false,
                  },
                  "AES-CBC envelope encryption": {
                    description:
                      "Staging data will be encrypted using AES-CBC envelope encryption.",
                    title: "AES-CBC envelope encryption",
                    _type: "formGroup",
                    jsonSchema: {
                      description:
                        "Staging data will be encrypted using AES-CBC envelope encryption.",
                      properties: {
                        encryption_type: {
                          const: "aes_cbc_envelope",
                          default: "aes_cbc_envelope",
                          enum: ["aes_cbc_envelope"],
                          type: "string",
                        },
                        key_encrypting_key: {
                          airbyte_secret: true,
                          description:
                            "The key, base64-encoded. Must be either 128, 192, or 256 bits. Leave blank to have Airbyte generate an ephemeral key for each sync.",
                          title: "Key",
                          type: "string",
                        },
                      },
                      required: ["encryption_type"],
                      title: "AES-CBC envelope encryption",
                      type: "object",
                    },
                    path: "loading_method.encryption",
                    fieldKey: "encryption",
                    properties: [
                      {
                        const: "aes_cbc_envelope",
                        default: "aes_cbc_envelope",
                        _type: "formItem",
                        path: "loading_method.encryption.encryption_type",
                        fieldKey: "encryption_type",
                        isRequired: true,
                        isSecret: false,
                        multiline: false,
                        type: "string",
                      },
                      {
                        description:
                          "The key, base64-encoded. Must be either 128, 192, or 256 bits. Leave blank to have Airbyte generate an ephemeral key for each sync.",
                        title: "Key",
                        _type: "formItem",
                        path: "loading_method.encryption.key_encrypting_key",
                        fieldKey: "key_encrypting_key",
                        isRequired: false,
                        isSecret: true,
                        multiline: false,
                        type: "string",
                      },
                    ],
                    isRequired: false,
                  },
                },
                isRequired: false,
              },
              {
                description:
                  "The pattern allows you to set the file-name format for the S3 staging file(s)",
                examples: [
                  "{date}",
                  "{date:yyyy_MM}",
                  "{timestamp}",
                  "{part_number}",
                  "{sync_id}",
                ],
                order: 7,
                title: "S3 Filename pattern (Optional)",
                _type: "formItem",
                path: "loading_method.file_name_pattern",
                fieldKey: "file_name_pattern",
                isRequired: false,
                isSecret: false,
                multiline: false,
                type: "string",
              },
            ],
            isRequired: false,
          },
          "Google Cloud Storage Staging": {
            description:
              "Recommended for large production workloads for better speed and scalability.",
            title: "Google Cloud Storage Staging",
            _type: "formGroup",
            jsonSchema: {
              description:
                "Recommended for large production workloads for better speed and scalability.",
              properties: {
                bucket_name: {
                  description:
                    'Enter the <a href="https://cloud.google.com/storage/docs/creating-buckets">Cloud Storage bucket name</a>',
                  examples: ["airbyte-staging"],
                  order: 2,
                  title: "Cloud Storage bucket name",
                  type: "string",
                },
                credentials_json: {
                  airbyte_secret: true,
                  description:
                    'Enter your <a href="https://cloud.google.com/iam/docs/creating-managing-service-account-keys#creating_service_account_keys">Google Cloud service account key</a> in the JSON format with read/write access to your Cloud Storage staging bucket',
                  multiline: true,
                  order: 3,
                  title: "Google Application Credentials",
                  type: "string",
                },
                method: {
                  default: "GCS Staging",
                  description: "",
                  enum: ["GCS Staging"],
                  order: 0,
                  title: "",
                  type: "string",
                },
                project_id: {
                  description:
                    'Enter the <a href="https://cloud.google.com/resource-manager/docs/creating-managing-projects#identifying_projects">Google Cloud project ID</a>',
                  examples: ["my-project"],
                  order: 1,
                  title: "Google Cloud project ID",
                  type: "string",
                },
              },
              required: [
                "method",
                "project_id",
                "bucket_name",
                "credentials_json",
              ],
              title: "Google Cloud Storage Staging",
              type: "object",
            },
            path: "loading_method",
            fieldKey: "loading_method",
            properties: [
              {
                default: "GCS Staging",
                description: "",
                order: 0,
                title: "",
                const: "GCS Staging",
                _type: "formItem",
                path: "loading_method.method",
                fieldKey: "method",
                isRequired: true,
                isSecret: false,
                multiline: false,
                type: "string",
              },
              {
                description:
                  'Enter the <a href="https://cloud.google.com/resource-manager/docs/creating-managing-projects#identifying_projects">Google Cloud project ID</a>',
                examples: ["my-project"],
                order: 1,
                title: "Google Cloud project ID",
                _type: "formItem",
                path: "loading_method.project_id",
                fieldKey: "project_id",
                isRequired: true,
                isSecret: false,
                multiline: false,
                type: "string",
              },
              {
                description:
                  'Enter the <a href="https://cloud.google.com/storage/docs/creating-buckets">Cloud Storage bucket name</a>',
                examples: ["airbyte-staging"],
                order: 2,
                title: "Cloud Storage bucket name",
                _type: "formItem",
                path: "loading_method.bucket_name",
                fieldKey: "bucket_name",
                isRequired: true,
                isSecret: false,
                multiline: false,
                type: "string",
              },
              {
                description:
                  'Enter your <a href="https://cloud.google.com/iam/docs/creating-managing-service-account-keys#creating_service_account_keys">Google Cloud service account key</a> in the JSON format with read/write access to your Cloud Storage staging bucket',
                order: 3,
                title: "Google Application Credentials",
                _type: "formItem",
                path: "loading_method.credentials_json",
                fieldKey: "credentials_json",
                isRequired: true,
                isSecret: true,
                multiline: true,
                type: "string",
              },
            ],
            isRequired: false,
          },
          "Azure Blob Storage Staging": {
            description:
              "Recommended for large production workloads for better speed and scalability.",
            title: "Azure Blob Storage Staging",
            _type: "formGroup",
            jsonSchema: {
              description:
                "Recommended for large production workloads for better speed and scalability.",
              properties: {
                azure_blob_storage_account_name: {
                  description: "Enter your Azure Blob Storage account name",
                  examples: ["airbyte5storage"],
                  order: 2,
                  title:
                    'Azure Blob Storage <a href="https://docs.microsoft.com/en-us/azure/storage/common/storage-account-overview#storage-account-endpoints">account name</a>',
                  type: "string",
                },
                azure_blob_storage_container_name: {
                  description:
                    'Enter your Azure Blob Storage <a href="https://docs.microsoft.com/en-us/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#container-names">container name</a>',
                  examples: ["airbytetestcontainername"],
                  order: 3,
                  title: "Azure Blob Storage Container Name",
                  type: "string",
                },
                azure_blob_storage_endpoint_domain_name: {
                  default: "blob.core.windows.net",
                  description:
                    'Enter the Azure Blob Storage <a href="https://docs.microsoft.com/en-us/azure/storage/common/storage-account-overview#storage-account-endpoints">endpoint domain name</a>',
                  examples: ["blob.core.windows.net"],
                  order: 1,
                  title: "Azure Blob Storage Endpoint",
                  type: "string",
                },
                azure_blob_storage_sas_token: {
                  airbyte_secret: true,
                  description:
                    'Enter the <a href="https://docs.snowflake.com/en/user-guide/data-load-azure-config.html#option-2-generating-a-sas-token">Shared access signature</a> (SAS) token to grant Snowflake limited access to objects in your Azure Blob Storage account',
                  examples: [
                    "?sv=2016-05-31&ss=b&srt=sco&sp=rwdl&se=2018-06-27T10:05:50Z&st=2017-06-27T02:05:50Z&spr=https,http&sig=bgqQwoXwxzuD2GJfagRg7VOS8hzNr3QLT7rhS8OFRLQ%3D",
                  ],
                  order: 4,
                  title: "SAS Token",
                  type: "string",
                },
                method: {
                  default: "Azure Blob Staging",
                  description: "",
                  enum: ["Azure Blob Staging"],
                  order: 0,
                  title: "",
                  type: "string",
                },
              },
              required: [
                "method",
                "azure_blob_storage_account_name",
                "azure_blob_storage_container_name",
                "azure_blob_storage_sas_token",
              ],
              title: "Azure Blob Storage Staging",
              type: "object",
            },
            path: "loading_method",
            fieldKey: "loading_method",
            properties: [
              {
                default: "Azure Blob Staging",
                description: "",
                order: 0,
                title: "",
                const: "Azure Blob Staging",
                _type: "formItem",
                path: "loading_method.method",
                fieldKey: "method",
                isRequired: true,
                isSecret: false,
                multiline: false,
                type: "string",
              },
              {
                default: "blob.core.windows.net",
                description:
                  'Enter the Azure Blob Storage <a href="https://docs.microsoft.com/en-us/azure/storage/common/storage-account-overview#storage-account-endpoints">endpoint domain name</a>',
                examples: ["blob.core.windows.net"],
                order: 1,
                title: "Azure Blob Storage Endpoint",
                _type: "formItem",
                path: "loading_method.azure_blob_storage_endpoint_domain_name",
                fieldKey: "azure_blob_storage_endpoint_domain_name",
                isRequired: false,
                isSecret: false,
                multiline: false,
                type: "string",
              },
              {
                description: "Enter your Azure Blob Storage account name",
                examples: ["airbyte5storage"],
                order: 2,
                title:
                  'Azure Blob Storage <a href="https://docs.microsoft.com/en-us/azure/storage/common/storage-account-overview#storage-account-endpoints">account name</a>',
                _type: "formItem",
                path: "loading_method.azure_blob_storage_account_name",
                fieldKey: "azure_blob_storage_account_name",
                isRequired: true,
                isSecret: false,
                multiline: false,
                type: "string",
              },
              {
                description:
                  'Enter your Azure Blob Storage <a href="https://docs.microsoft.com/en-us/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#container-names">container name</a>',
                examples: ["airbytetestcontainername"],
                order: 3,
                title: "Azure Blob Storage Container Name",
                _type: "formItem",
                path: "loading_method.azure_blob_storage_container_name",
                fieldKey: "azure_blob_storage_container_name",
                isRequired: true,
                isSecret: false,
                multiline: false,
                type: "string",
              },
              {
                description:
                  'Enter the <a href="https://docs.snowflake.com/en/user-guide/data-load-azure-config.html#option-2-generating-a-sas-token">Shared access signature</a> (SAS) token to grant Snowflake limited access to objects in your Azure Blob Storage account',
                examples: [
                  "?sv=2016-05-31&ss=b&srt=sco&sp=rwdl&se=2018-06-27T10:05:50Z&st=2017-06-27T02:05:50Z&spr=https,http&sig=bgqQwoXwxzuD2GJfagRg7VOS8hzNr3QLT7rhS8OFRLQ%3D",
                ],
                order: 4,
                title: "SAS Token",
                _type: "formItem",
                path: "loading_method.azure_blob_storage_sas_token",
                fieldKey: "azure_blob_storage_sas_token",
                isRequired: true,
                isSecret: true,
                multiline: false,
                type: "string",
              },
            ],
            isRequired: false,
          },
        },
        isRequired: false,
      },
    ],
    fieldKey: "",
    isRequired: false,
    path: "",
  };

  const initialValues = {
    "loading_method.method": "Internal Staging",
    "credentials.auth_type": "OAuth2.0",
    configuration: {
      loading_method: {
        method: "Internal Staging",
      },
      credentials: {
        auth_type: "OAuth2.0",
      },
    },
  };

  const selectedConditionMap = pickSelectedConditionMap(
    formTree,
    initialValues
  );

  expect(selectedConditionMap).toEqual({
    loading_method: {
      selectedItem: "[Recommended] Internal Staging",
    },
    credentials: {
      selectedItem: "OAuth2.0",
    },
  });
});
