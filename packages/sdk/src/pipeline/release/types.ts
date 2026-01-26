import { z } from "zod";

import {
  DataSpecification,
  DataSpecificationSchema,
  GeneralRecord,
} from "../../types";
import { PipelineSharing } from "../pipeline";
import { PipelineRecipe, ResourceViewWithRecipeView } from "../types";

export type PipelineRelease = {
  name: string;
  uid: string;
  id: string;
  description: string;
  recipe: PipelineRecipe;
  createTime: string;
  updateTime: string;
  deleteTime?: string;
  metadata: GeneralRecord;
  alias: string;
  readme: string;
  rawRecipe: string;
  dataSpecification: DataSpecification;
};

export const PipelineReleaseSchema = z.object({
  name: z.string(),
  uid: z.string(),
  id: z.string(),
  description: z.string(),

  // Our openapi isn't fully typed on the recipe field yet
  recipe: z.record(z.any()),
  createTime: z.string(),
  updateTime: z.string(),
  deleteTime: z.string().optional(),
  metadata: z.record(z.any()),
  alias: z.string().optional(),
  readme: z.string(),
  rawRecipe: z.string(),
  dataSpecification: DataSpecificationSchema,
});

export type GetNamespacePipelineReleaseRequest = {
  namespaceId: string;
  pipelineId: string;
  releaseId: string;
  view?: ResourceViewWithRecipeView;
};

export type GetNamespacePipelineReleaseResponse = {
  release: PipelineRelease;
};

export type ListNamespacePipelineReleaseRequest = {
  namespaceId: string;
  pipelineId: string;
  view?: ResourceViewWithRecipeView;
  pageSize?: number;
  pageToken?: string;
  filter?: string;
  shareCode?: string;
};

export type ListNamespacePipelineReleaseResponse = {
  releases: PipelineRelease[];
  nextPageToken: string;
  totalSize: number;
};

export type CreateNamespacePipelineReleaseRequest = {
  namespaceId: string;
  pipelineId: string;

  /**
   * Release resource ID (used in name as the last segment). It must be a
   * sematic version vX.Y.Z.
   */
  id: string;
  description?: string;
  metadata?: GeneralRecord;
  readme?: string;
  rawRecipe?: string;
};

export type CreateNamespacePipelineReleaseResponse = {
  release: PipelineRelease;
};

export type DeleteNamespacePipelineReleaseRequest = {
  namespaceId: string;
  pipelineId: string;
  releaseId: string;
};

export type UpdateNamespacePipelineReleaseRequest = {
  namespaceId: string;
  pipelineId: string;
  releaseId: string;
  description?: string;
  metadata?: GeneralRecord;
  readme?: string;
  rawRecipe?: string;
};

export type UpdateNamespacePipelineReleaseResponse = {
  release: PipelineRelease;
};

export type CloneNamespacePipelineReleaseRequest = {
  namespaceId: string;
  pipelineId: string;
  releaseId: string;
  targetNamespaceId: string;
  targetPipelineId: string;
  description?: string;
  sharing?: PipelineSharing;
};
