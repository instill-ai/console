import {
  Nullable,
  OrganizationSubscription,
  OrganizationSubscriptionPlan,
  UserSubscription,
  UserSubscriptionPlan,
} from "instill-sdk";

import { Icons } from "@instill-ai/design-system";

import { getInstillAPIClient } from "../../../../lib";
import { FileStatus } from "../../../../lib/react-query-service/knowledge/types";
import { STORAGE_WARNING_THRESHOLD } from "./constant";


export const getStatusSortValue = (status: FileStatus): number => {
  const statusOrder: Record<FileStatus, number> = {
    FILE_PROCESS_STATUS_NOTSTARTED: 0,
    FILE_PROCESS_STATUS_WAITING: 1,
    FILE_PROCESS_STATUS_CONVERTING: 2,
    FILE_PROCESS_STATUS_CHUNKING: 3,
    FILE_PROCESS_STATUS_EMBEDDING: 4,
    FILE_PROCESS_STATUS_COMPLETED: 5,
    FILE_PROCESS_STATUS_FAILED: 6,
  };
  return statusOrder[status] ?? -1;
};

export const getFileIcon = (fileType: string) => {
  switch (fileType.toUpperCase()) {
    case "FILE_TYPE_MARKDOWN":
      return <Icons.MDFile className="h-5 w-5" />;
    case "FILE_TYPE_TEXT":
      return <Icons.TXTFile className="h-5 w-5" />;
    case "FILE_TYPE_PDF":
      return <Icons.PDFFile className="h-5 w-5" />;
    case "FILE_TYPE_DOC":
      return <Icons.DOCFile className="h-5 w-5" />;
    case "FILE_TYPE_DOCX":
      return <Icons.DOCXFile className="h-5 w-5" />;
    case "FILE_TYPE_PPT":
      return <Icons.PPTFile className="h-5 w-5" />;
    case "FILE_TYPE_PPTX":
      return <Icons.PPTXFile className="h-5 w-5" />;
    case "FILE_TYPE_HTML":
      return <Icons.HTMLFile className="h-5 w-5" />;
    default:
      return <Icons.File05 className="h-5 w-5" />;
  }
};

export const getFileType = (file: File) => {
  const extension = file.name.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "txt":
      return "FILE_TYPE_TEXT";
    case "md":
    case "markdown":
      return "FILE_TYPE_MARKDOWN";
    case "pdf":
      return "FILE_TYPE_PDF";
    case "docx":
      return "FILE_TYPE_DOCX";
    case "doc":
      return "FILE_TYPE_DOC";
    case "pptx":
      return "FILE_TYPE_PPTX";
    case "ppt":
      return "FILE_TYPE_PPT";
    case "html":
      return "FILE_TYPE_HTML";
    default:
      return "FILE_TYPE_UNSPECIFIED";
  }
};

export const convertFileType = (type: string): string => {
  switch (type) {
    case "FILE_TYPE_TEXT":
      return "txt";
    case "FILE_TYPE_MARKDOWN":
      return "md";
    case "FILE_TYPE_PDF":
      return "pdf";
    case "FILE_TYPE_DOCX":
      return "docx";
    case "FILE_TYPE_DOC":
      return "doc";
    case "FILE_TYPE_PPTX":
      return "pptx";
    case "FILE_TYPE_PPT":
      return "ppt";
    case "FILE_TYPE_HTML":
      return "html";
    default:
      return type.replace("FILE_TYPE_", "").toLowerCase();
  }
};

export const truncateName = (name: string, maxLength: number = 20) => {
  if (name.length <= maxLength) return name;
  return `${name.slice(0, maxLength)}...`;
};

export const getPlanMaxFileSize = (
  plan: UserSubscriptionPlan | OrganizationSubscriptionPlan,
): number => {
  switch (plan) {
    case "PLAN_FREE":
      return 50 * 1024 * 1024; // 50MB
    case "PLAN_PRO":
    case "PLAN_TEAM":
    case "PLAN_ENTERPRISE":
      return 150 * 1024 * 1024; // 150MB
    default:
      return 50 * 1024 * 1024; // Default to 50MB
  }
};

export const getPlanStorageLimit = (
  plan: UserSubscriptionPlan | OrganizationSubscriptionPlan,
): number => {
  switch (plan) {
    case "PLAN_FREE":
      return 50 * 1024 * 1024; // 50MB
    case "PLAN_PRO":
      return 500 * 1024 * 1024; // 500MB
    case "PLAN_TEAM":
      return 2 * 1024 * 1024 * 1024; // 2GB
    case "PLAN_ENTERPRISE":
      return Infinity; // Unlimited storage
    default:
      return 50 * 1024 * 1024; // Default to 50MB
  }
};

export const getKnowledgeBaseLimit = (
  plan: UserSubscriptionPlan | OrganizationSubscriptionPlan,
): number => {
  switch (plan) {
    case "PLAN_FREE":
      return 10;
    case "PLAN_PRO":
      return 50;
    case "PLAN_TEAM":
      return Infinity;
    case "PLAN_ENTERPRISE":
      return Infinity;
    default:
      return 10;
  }
};

export const getSubscriptionInfo = (
  namespaceType: Nullable<"user" | "organization">,
  userSub: Nullable<UserSubscription>,
  orgSub: Nullable<OrganizationSubscription>,
) => {
  const subscription = namespaceType === "organization" ? orgSub : userSub;
  const plan = subscription?.plan || "PLAN_FREE";
  const planStorageLimit = getPlanStorageLimit(plan);
  const planMaxFileSize = getPlanMaxFileSize(plan);

  return { subscription, plan, planStorageLimit, planMaxFileSize };
};

export const checkNamespaceType = async (
  selectedNamespace: string,
  accessToken: string,
) => {
  try {
    const client = getInstillAPIClient({ accessToken });
    const type = await client.core.utils.checkNamespaceType({
      id: selectedNamespace,
    });
    return type === "NAMESPACE_USER" ? "user" : "organization";
  } catch (error) {
    console.error("Error checking namespace type:", error);
    return null;
  }
};

export const calculateRemainingStorage = (
  planStorageLimit: number,
  usedStorage: number,
): number => {
  return Math.max(0, planStorageLimit - usedStorage);
};

export const getPlanStorageLimitMB = (size: number): string => {
  return (size / (1024 * 1024)).toFixed(2);
};

export const shouldShowStorageWarning = (
  remainingStorageSpace: number,
  planStorageLimit: number
): boolean => {
  return (remainingStorageSpace / planStorageLimit) * 100 <= STORAGE_WARNING_THRESHOLD;
};

export const formatFileSize = (bytes: number | undefined): string => {
  if (bytes === undefined || isNaN(bytes)) return "N/A";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  if (i === 0) return bytes + " " + sizes[i];
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString();
};
