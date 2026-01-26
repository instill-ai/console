import { JSONSchema7TypeName } from "json-schema";
import { z } from "zod";

import {
  DataSpecification,
  DataSpecificationSchema,
  GeneralRecord,
  Nullable,
  Owner,
  OwnerSchema,
  Permission,
  PermissionSchema,
} from "../../types";
import { PipelineRelease, PipelineReleaseSchema } from "../release";
import {
  PipelineRecipe,
  ResourceView,
  ResourceViewWithRecipeView,
} from "../types";

export type PipelineMode = "MODE_UNSPECIFIED" | "MODE_SYNC" | "MODE_ASYNC";

export type PipelineReleaseState =
  | "STATE_UNSPECIFIED"
  | "STATE_ACTIVE"
  | "STATE_INACTIVE"
  | "STATE_ERROR"
  | "STATE_DELETED";

export type PipelineReleaseWatchState = {
  state: PipelineReleaseState;
  progress: number;
};

export type PipelineComponentType =
  | "COMPONENT_TYPE_UNSPECIFIED"
  | "COMPONENT_TYPE_CONNECTOR_AI"
  | "COMPONENT_TYPE_CONNECTOR_DATA"
  | "COMPONENT_TYPE_CONNECTOR_APPLICATION"
  | "COMPONENT_TYPE_OPERATOR"
  | "COMPONENT_TYPE_GENERIC";

export type PipelineReleasesWatchState = Record<
  string,
  PipelineReleaseWatchState
>;

export type PipelineStats = {
  lastRunTime: string;
  numberOfRuns: number;
};

export const PipelineStatsSchema = z.object({
  lastRunTime: z.string(),
  numberOfRuns: z.number(),
});

export type PermissionRole =
  | "ROLE_UNSPECIFIED"
  | "ROLE_VIEWER"
  | "ROLE_EXECUTOR";

export const PermissionRoleSchema = z.enum([
  "ROLE_UNSPECIFIED",
  "ROLE_VIEWER",
  "ROLE_EXECUTOR",
]);

export type PipelineSharingCodeRule = {
  user: string;
  code?: string;
  enabled: boolean;
  role: PermissionRole;
};

export const PipelineSharingCodeRuleSchema = z.object({
  user: z.string(),
  code: z.string().optional(),
  enabled: z.boolean(),
  role: PermissionRoleSchema,
});

export type PipelineSharingUserRules = Record<
  string,
  | {
      enabled: boolean;
      role: PermissionRole;
    }
  | undefined
>;

export const PipelineSharingUserRulesSchema = z.record(
  z
    .object({
      enabled: z.boolean(),
      role: PermissionRoleSchema,
    })
    .optional(),
);

export type PipelineSharing = {
  users: PipelineSharingUserRules;
  shareCode: Nullable<PipelineSharingCodeRule>;
};

export const PipelineSharingSchema = z.object({
  users: PipelineSharingUserRulesSchema,
  shareCode: PipelineSharingCodeRuleSchema.nullable(),
});

export type Pipeline = {
  // ===== Standard AIP fields =====
  // Canonical resource name. Format: `namespaces/{namespace}/pipelines/{pipeline}`
  name: string;
  // Immutable canonical resource ID (e.g., "pip-8f3a2k9E7c1")
  id: string;
  // Human-readable display name for UI
  displayName: string;
  // URL-friendly slug (NO prefix)
  slug?: string;
  // Previous slugs for backward compatibility
  aliases?: string[];
  // Optional description
  description?: string;
  // ===== Timestamps =====
  createTime: string;
  updateTime: string;
  // ===== Resource-specific fields =====
  readme: string;
  recipe: Nullable<PipelineRecipe>;
  rawRecipe: Nullable<string>;
  dataSpecification: DataSpecification;
  owner: Owner;
  ownerName: string;
  releases: PipelineRelease[];
  sharing: PipelineSharing;
  metadata: GeneralRecord;
  permission: Permission;
  tags: string[];
  stats: PipelineStats;
  profileImage: string;
  sourceUrl: string;
  documentationUrl: string;
  license: string;
  endpoints: {
    webhooks: Record<
      string,
      {
        description: string;
        url: string;
      }
    >;
  };
};

export const PipelineSchema = z.object({
  name: z.string(),
  id: z.string(),
  displayName: z.string().optional(),
  slug: z.string().optional(),
  aliases: z.array(z.string()).optional(),
  description: z.string().optional(),
  createTime: z.string(),
  updateTime: z.string(),

  readme: z.string(),
  // Our openapi isn't fully typed on the recipe field yet
  recipe: z.record(z.any()),
  dataSpecification: DataSpecificationSchema,
  owner: OwnerSchema,
  ownerName: z.string(),
  releases: z.array(PipelineReleaseSchema),
  sharing: PipelineSharingSchema,
  metadata: z.record(z.any()),
  permission: PermissionSchema,
  tags: z.array(z.string()),
  stats: PipelineStatsSchema,
  profileImage: z.string(),
  sourceUrl: z.string(),
  documentationUrl: z.string(),
  license: z.string(),
});

export type PipelineTrace = {
  success: boolean;
  inputs: GeneralRecord[];
  outputs: GeneralRecord[];
  error: GeneralRecord;
  computeYimeInSeconds: number;
};

export type StartOperatorInputType =
  | "audio/*"
  | "image/*"
  | "long_string"
  | "array:image/*"
  | "array:audio/*"
  | "array:string"
  | "*/*"
  | "array:*/*"
  | "semi-structured/json"
  | "video/*"
  | "array:video/*"
  | JSONSchema7TypeName;

export type IteratorDefinition = {
  name: "iterator/iterator";
  uid: "uid";
  id: "iterator";
  title: "Iterator";
  icon: "iterator.svg";
};

export type HubStatsResponse = {
  numberOfPublicPipelines: number;
  numberOfFeaturedPipelines: number;
};

export type ListAccessiblePipelinesRequest = {
  pageSize?: number;
  pageToken?: string;
  filter?: string;
  view?: ResourceView;
  showDeleted?: boolean;
  visibility?: string;
  orderBy?: string;
};

export type ListAccessiblePipelineResponse = {
  pipelines: Pipeline[];
  nextPageToken: string;
  totalSize: number;
};

export const listAccessiblePipelinesWithPaginationResponseValidator = z.object({
  pipelines: z.array(PipelineSchema),
  nextPageToken: z.string(),
  totalSize: z.number(),
});

export type ListNamespacePipelinesRequest = {
  namespaceId: string;
  pageSize?: number;
  pageToken?: string;
  filter?: string;
  view?: ResourceView;
  showDeleted?: boolean;
  visibility?: string;
  orderBy?: string;
};

export type ListNamespacePipelinesResponse = {
  pipelines: Pipeline[];
  nextPageToken: string;
  totalSize: number;
};

export const listNamespacePipelinesWithPaginationResponseValidator = z.object({
  pipelines: z.array(PipelineSchema),
  nextPageToken: z.string(),
  totalSize: z.number(),
});

export type GetNamespacePipelineRequest = {
  namespaceId: string;
  pipelineId: string;
  view?: ResourceViewWithRecipeView;
  shareCode?: string;
};

export type GetNamespacePipelineResponse = {
  pipeline: Pipeline;
};

export const getNamespacePipelineResponseValidator = PipelineSchema;

export type CreateNamespacePipelineRequest = {
  namespaceId: string;
  id: string;
  description?: string;
  recipe?: PipelineRecipe;
  metadata: GeneralRecord;
  sharing?: PipelineSharing;
  readme?: string;
  rawRecipe?: string;
};

export type CreateNamespacePipelineResponse = {
  pipeline: Pipeline;
};

export const createNamespacePipelineResponseValidator = PipelineSchema;

export type DeleteNamespacePipelineRequest = {
  namespaceId: string;
  pipelineId: string;
};

export type UpdateNamespacePipelineRequest = {
  namespaceId: string;
  pipelineId: string;
  description?: string;
  recipe?: PipelineRecipe;
  sharing?: PipelineSharing;
  metadata?: GeneralRecord;
  readme?: string;
  tags?: string[];
  rawRecipe?: string;
  sourceUrl?: string;
  documentationUrl?: string;
  license?: string;
  profileImage?: string;
};

export type UpdateNamespacePipelineResponse = {
  pipeline: Pipeline;
};

export const updateNamespacePipelineResponseValidator = PipelineSchema;

export type ValidatePipelineRecipeError = {
  location: string;
  error: string;
};

export type ValidateNamespacePipelineRequest = {
  namespaceId: string;
  pipelineId: string;
};

export type ValidateNamespacePipelineResponse = {
  success: boolean;
  errors: ValidatePipelineRecipeError[];
};

export type RenameNamespacePipelineRequest = {
  namespaceId: string;
  pipelineId: string;
  newPipelineId: string;
};

export type RenameNamespacePipelineResponse = {
  pipeline: Pipeline;
};

export type CloneNamespacePipelineRequest = {
  namespaceId: string;
  pipelineId: string;
  targetNamespaceId: string;
  targetPipelineId: string;
  description?: string;
  sharing?: PipelineSharing;
};
