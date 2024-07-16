import { OpenAPIV3 } from "openapi-types";

import { GeneralRecord, Visibility } from "../../types";
import { PipelineRecipe } from "../pipeline";

export type PipelineRelease = {
  name: string;
  uid: string;
  id: string;
  description: string;
  recipe: PipelineRecipe;
  createTime: string;
  updateTime: string;
  visibility: Visibility;
  openapiSchema: OpenAPIV3.Document;
  metadata: GeneralRecord;
  alias?: string;
};

export type GetNamespacePipelineReleaseRequest = {
  namespacePipelineReleaseName: string;
  view?: string;
};

export type GetNamespacePipelineReleaseResponse = {
  release: PipelineRelease;
};

export type ListNamespacePipelineReleaseRequest = {
  namespacePipelineName: string;
  view?: string;
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
  namespacePipelineName: string;

  /**
   * Release resource ID (used in name as the last segment). It must be a
   * sematic version vX.Y.Z.
   */
  id: string;
  description?: string;
  metadata?: GeneralRecord;
  readme?: string;
};

export type CreateNamespacePipelineReleaseResponse = {
  release: PipelineRelease;
};

export type DeleteNamespacePipelineReleaseRequest = {
  namespacePipelineReleaseName: string;
};

export type UpdateNamespacePipelineReleaseRequest = {
  namespacePipelineReleaseName: string;
  description?: string;
};

export type UpdateNamespacePipelineReleaseResponse = {
  release: PipelineRelease;
};

export type SetPinnedNamespacePipelineReleaseRequest = {
  namespacePipelineReleaseName: string;
};

export type SetPinnedNamespacePipelineReleaseResponse = {
  release: PipelineRelease;
};

export type RenameNamespacePipelineReleaseRequest = {
  namespacePipelineReleaseName: string;
  newPipelineReleaseId: string;
};

export type RenameNamespacePipelineReleaseResponse = {
  release: PipelineRelease;
};
