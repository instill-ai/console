import {
  Catalog,
  CatalogFile,
  FileStatus,
  FileType,
  Nullable,
  OrganizationSubscription,
  OrganizationSubscriptionPlan,
  UserSubscription,
  UserSubscriptionPlan,
} from "instill-sdk";

import { Icons } from "@instill-ai/design-system";

import { getInstillAPIClient } from "../../../../lib";
import { MAX_FILE_NAME_LENGTH, STORAGE_WARNING_THRESHOLD } from "./constant";

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
    case "FILE_TYPE_CSV":
      return <Icons.CSVFile className="h-5 w-5" />;
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
    case "FILE_TYPE_XLS":
      return <Icons.XLSFile className="h-5 w-5" />;
    case "FILE_TYPE_XLSX":
      return <Icons.XLSXFile className="h-5 w-5" />;
    default:
      return <Icons.File05 className="h-5 w-5" />;
  }
};

export const getFileType = (file: File): FileType => {
  const extension = file.name.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "txt":
      return "FILE_TYPE_TEXT";
    case "md":
    case "markdown":
      return "FILE_TYPE_MARKDOWN";
    case "csv":
      return "FILE_TYPE_CSV";
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
    case "xls":
      return "FILE_TYPE_XLS";
    case "xlsx":
      return "FILE_TYPE_XLSX";
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
    case "FILE_TYPE_CSV":
      return "csv";
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
    case "FILE_TYPE_XLS":
      return "xls";
    case "FILE_TYPE_XLSX":
      return "xlsx";
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

export const getCatalogLimit = (
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
  planStorageLimit: number,
): boolean => {
  return (
    (remainingStorageSpace / planStorageLimit) * 100 <=
    STORAGE_WARNING_THRESHOLD
  );
};

export const formatFileSize = (bytes: number | undefined): string => {
  if (bytes === undefined || isNaN(bytes)) return "N/A";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  if (i === 0) return bytes + " " + sizes[i];
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
};

export const formatDateFileTableRow = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

export const convertTagsToArray = (
  tags: string | string[] | undefined,
): string[] => {
  if (Array.isArray(tags)) {
    return tags.map((tag) => tag.trim()).filter((tag) => tag !== "");
  }
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
  }
  return [];
};

export const formatName = (name: string) => {
  // First, lowercase the name and replace invalid characters with hyphens
  let formatted = name.toLowerCase().replace(/[^a-z0-9-]/g, "-");

  // Remove leading hyphens
  formatted = formatted.replace(/^-+/, "");

  // Ensure it starts with a letter
  if (!/^[a-z]/.test(formatted)) {
    formatted = "c" + formatted;
  }

  // Remove consecutive hyphens
  formatted = formatted.replace(/-+/g, "-");

  // Truncate to 32 characters
  formatted = formatted.slice(0, 32);

  // Remove trailing hyphens
  formatted = formatted.replace(/-+$/, "");

  return formatted;
};

export const isFile = (value: unknown): value is File => {
  return typeof window !== "undefined" && value instanceof File;
};

export const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(btoa(reader.result));
      } else {
        reject(new Error("Failed to read file as base64"));
      }
    };
    reader.onerror = reject;
    reader.readAsBinaryString(file);
  });
};

export const validateFile = (
  file: File,
  planMaxFileSize: number,
  remainingStorageSpace: number,
  existingFiles: CatalogFile[],
) => {
  if (file.size > planMaxFileSize) {
    return { isValid: false, error: "FILE_TOO_LARGE" };
  }

  if (file.size > remainingStorageSpace) {
    return { isValid: false, error: "INSUFFICIENT_STORAGE" };
  }

  const fileType = getFileType(file);
  if (fileType === "FILE_TYPE_UNSPECIFIED") {
    return { isValid: false, error: "UNSUPPORTED_FILE_TYPE" };
  }

  if (file.name.length > MAX_FILE_NAME_LENGTH) {
    return { isValid: false, error: "FILE_NAME_TOO_LONG" };
  }

  const isDuplicate = existingFiles.some(
    (existingFile) => existingFile.name === file.name,
  );
  if (isDuplicate) {
    return { isValid: false, error: "DUPLICATE_FILE" };
  }

  return { isValid: true, error: null };
};

export const getCatalogNameByUid = (
  catalogUid: string | undefined,
  catalogs: Catalog[],
): string => {
  const catalog = catalogs.find((c) => c.catalogUid === catalogUid);
  return catalog ? catalog.name : "Select";
};

export const getCatalogUidByName = (
  catalogName: string,
  catalogs: Catalog[] | undefined,
): string | undefined => {
  const catalog = catalogs?.find((catalog) => catalog.name === catalogName);
  return catalog?.catalogUid;
};

export const getFileTypeByExtension = (extension: string) => {
  switch (extension) {
    case "txt":
      return "FILE_TYPE_TEXT";
    case "md":
    case "markdown":
      return "FILE_TYPE_MARKDOWN";
    case "csv":
      return "FILE_TYPE_CSV";
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
    case "xls":
      return "FILE_TYPE_XLS";
    case "xlsx":
      return "FILE_TYPE_XLSX";
    default:
      return "FILE_TYPE_UNSPECIFIED";
  }
};
