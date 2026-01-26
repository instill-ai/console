import {
  FileProcessStatus,
  FileType,
  KnowledgeBase,
  File as KnowledgeBaseFile,
  Nullable,
} from "instill-sdk";

import { Icons } from "@instill-ai/design-system";

import { getInstillAPIClient } from "../../../../lib";
import { MAX_FILE_NAME_LENGTH, STORAGE_WARNING_THRESHOLD } from "./constant";

// CE stub types - subscription features are EE-only
export type UserSubscriptionPlan = string;
export type OrganizationSubscriptionPlan = string;
export type UserSubscription = { plan: string } | null;
export type OrganizationSubscription = { plan: string } | null;

export const getStatusSortValue = (status: FileProcessStatus): number => {
  const statusOrder: Record<FileProcessStatus, number> = {
    FILE_PROCESS_STATUS_UNSPECIFIED: -1,
    FILE_PROCESS_STATUS_NOTSTARTED: 0,
    FILE_PROCESS_STATUS_PROCESSING: 1,
    FILE_PROCESS_STATUS_CHUNKING: 2,
    FILE_PROCESS_STATUS_EMBEDDING: 3,
    FILE_PROCESS_STATUS_COMPLETED: 4,
    FILE_PROCESS_STATUS_FAILED: 5,
  };
  return statusOrder[status] ?? -1;
};

export const getFileIcon = (fileType: string) => {
  // Normalize the fileType by removing FILE_ prefix if it exists
  const normalizedType = fileType.toUpperCase().replace(/^FILE_/, "");

  switch (normalizedType) {
    // Text-based document types
    case "TYPE_MARKDOWN":
      return <Icons.MDFile className="h-5 w-5" />;
    case "TYPE_TEXT":
      return <Icons.TXTFile className="h-5 w-5" />;
    case "TYPE_CSV":
      return <Icons.CSVFile className="h-5 w-5" />;
    case "TYPE_HTML":
      return <Icons.HTMLFile className="h-5 w-5" />;
    // Container-based document types
    case "TYPE_PDF":
      return <Icons.PDFFile className="h-5 w-5" />;
    case "TYPE_DOC":
      return <Icons.DOCFile className="h-5 w-5" />;
    case "TYPE_DOCX":
      return <Icons.DOCXFile className="h-5 w-5" />;
    case "TYPE_PPT":
      return <Icons.PPTFile className="h-5 w-5" />;
    case "TYPE_PPTX":
      return <Icons.PPTXFile className="h-5 w-5" />;
    case "TYPE_XLS":
      return <Icons.XLSFile className="h-5 w-5" />;
    case "TYPE_XLSX":
      return <Icons.XLSXFile className="h-5 w-5" />;
    // Image types
    case "TYPE_PNG":
      return <Icons.PNGFile className="h-5 w-5" />;
    case "TYPE_JPEG":
      return <Icons.JPEGFile className="h-5 w-5" />;
    case "TYPE_GIF":
      return <Icons.GIFFile className="h-5 w-5" />;
    case "TYPE_WEBP":
      return <Icons.WEBPFile className="h-5 w-5" />;
    case "TYPE_TIFF":
      return <Icons.TIFFFile className="h-5 w-5" />;
    case "TYPE_BMP":
      return <Icons.BMPFile className="h-5 w-5" />;
    case "TYPE_HEIC":
      return <Icons.HEICFile className="h-5 w-5" />;
    case "TYPE_HEIF":
      return <Icons.HEIFFile className="h-5 w-5" />;
    case "TYPE_AVIF":
      return <Icons.AVIFFile className="h-5 w-5" />;
    // Video types
    case "TYPE_MP4":
      return <Icons.MP4File className="h-5 w-5" />;
    case "TYPE_AVI":
      return <Icons.AVIFile className="h-5 w-5" />;
    case "TYPE_MOV":
      return <Icons.MOVFile className="h-5 w-5" />;
    case "TYPE_WEBM_VIDEO":
      return <Icons.WEBMVideoFile className="h-5 w-5" />;
    case "TYPE_MKV":
      return <Icons.MKVFile className="h-5 w-5" />;
    case "TYPE_FLV":
      return <Icons.FLVFile className="h-5 w-5" />;
    case "TYPE_WMV":
      return <Icons.WMVFile className="h-5 w-5" />;
    case "TYPE_MPEG":
      return <Icons.MPEGFile className="h-5 w-5" />;
    // Audio types
    case "TYPE_MP3":
      return <Icons.MP3File className="h-5 w-5" />;
    case "TYPE_WAV":
      return <Icons.WAVFile className="h-5 w-5" />;
    case "TYPE_AAC":
      return <Icons.WEBMAudioFile className="h-5 w-5" />;
    case "TYPE_OGG":
      return <Icons.OGGFile className="h-5 w-5" />;
    case "TYPE_FLAC":
      return <Icons.FLACFile className="h-5 w-5" />;
    case "TYPE_M4A":
      return <Icons.M4AFile className="h-5 w-5" />;
    case "TYPE_WMA":
      return <Icons.WMAFile className="h-5 w-5" />;
    case "TYPE_AIFF":
      return <Icons.AIFFFile className="h-5 w-5" />;
    default:
      return <Icons.File05 className="h-5 w-5" />;
  }
};

export const getFileType = (file: File): FileType => {
  const extension = file.name.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "txt":
      return "TYPE_TEXT";
    case "md":
    case "markdown":
      return "TYPE_MARKDOWN";
    case "csv":
      return "TYPE_CSV";
    case "pdf":
      return "TYPE_PDF";
    case "docx":
      return "TYPE_DOCX";
    case "doc":
      return "TYPE_DOC";
    case "pptx":
      return "TYPE_PPTX";
    case "ppt":
      return "TYPE_PPT";
    case "html":
      return "TYPE_HTML";
    case "xls":
      return "TYPE_XLS";
    case "xlsx":
      return "TYPE_XLSX";
    case "png":
      return "TYPE_PNG";
    case "jpg":
      return "TYPE_JPG";
    case "jpeg":
      return "TYPE_JPEG";
    case "gif":
      return "TYPE_GIF";
    case "webp":
      return "TYPE_WEBP";
    case "tiff":
      return "TYPE_TIFF";
    case "bmp":
      return "TYPE_BMP";
    case "heic":
      return "TYPE_HEIC";
    case "heif":
      return "TYPE_HEIF";
    case "avif":
      return "TYPE_AVIF";
    case "mp3":
      return "TYPE_MP3";
    case "wav":
      return "TYPE_WAV";
    case "aac":
      return "TYPE_AAC";
    case "ogg":
      return "TYPE_OGG";
    case "flac":
      return "TYPE_FLAC";
    case "m4a":
      return "TYPE_M4A";
    case "wma":
      return "TYPE_WMA";
    case "aiff":
      return "TYPE_AIFF";
    case "mp4":
      return "TYPE_MP4";
    case "avi":
      return "TYPE_AVI";
    case "mov":
      return "TYPE_MOV";
    case "webm":
      return "TYPE_WEBM_VIDEO";
    case "mkv":
      return "TYPE_MKV";
    case "flv":
      return "TYPE_FLV";
    case "wmv":
      return "TYPE_WMV";
    case "mpeg":
      return "TYPE_MPEG";
    default:
      return "TYPE_UNSPECIFIED";
  }
};

export const convertFileType = (type: string): string => {
  switch (type) {
    case "TYPE_TEXT":
      return "txt";
    case "TYPE_MARKDOWN":
      return "md";
    case "TYPE_CSV":
      return "csv";
    case "TYPE_PDF":
      return "pdf";
    case "TYPE_DOCX":
      return "docx";
    case "TYPE_DOC":
      return "doc";
    case "TYPE_PPTX":
      return "pptx";
    case "TYPE_PPT":
      return "ppt";
    case "TYPE_HTML":
      return "html";
    case "TYPE_XLS":
      return "xls";
    case "TYPE_XLSX":
      return "xlsx";
    case "TYPE_PNG":
      return "png";
    case "TYPE_JPEG":
      return "jpeg";
    case "TYPE_JPG":
      return "jpg";
    case "TYPE_GIF":
      return "gif";
    case "TYPE_WEBP":
      return "webp";
    case "TYPE_TIFF":
      return "tiff";
    case "TYPE_BMP":
      return "bmp";
    case "TYPE_HEIC":
      return "heic";
    default:
      return type.replace("TYPE_", "").toLowerCase();
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
    case "PLAN_UNSPECIFIED":
    case "PLAN_FREE":
      return 50 * 1024 * 1024; // 50MB
    case "PLAN_STARTER":
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
    case "PLAN_UNSPECIFIED":
    case "PLAN_FREE":
      return 50 * 1024 * 1024; // 50MB
    case "PLAN_STARTER":
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
    case "PLAN_UNSPECIFIED":
    case "PLAN_FREE":
      return 10;
    case "PLAN_STARTER":
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
    const type = await client.mgmt.utils.checkNamespaceType({
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
  existingFiles: KnowledgeBaseFile[],
  isLocalEnvironment: boolean,
) => {
  if (!isLocalEnvironment) {
    if (file.size > planMaxFileSize) {
      return { isValid: false, error: "FILE_TOO_LARGE" };
    }

    if (file.size > remainingStorageSpace) {
      return { isValid: false, error: "INSUFFICIENT_STORAGE" };
    }
  }

  const fileType = getFileType(file);
  if (fileType === "TYPE_UNSPECIFIED") {
    return { isValid: false, error: "UNSUPPORTED_FILE_TYPE" };
  }

  if (file.name.length > MAX_FILE_NAME_LENGTH) {
    return { isValid: false, error: "FILE_NAME_TOO_LONG" };
  }

  const isDuplicate = existingFiles.some(
    (existingFile) => existingFile.filename === file.name,
  );
  if (isDuplicate) {
    return { isValid: false, error: "DUPLICATE_FILE" };
  }

  return { isValid: true, error: null };
};

export const getKnowledgeBaseNameByUid = (
  knowledgeBaseUid: string | undefined,
  knowledgeBases: KnowledgeBase[],
): string => {
  const knowledgeBase = knowledgeBases.find(
    (kb) => kb.knowledgeBaseUid === knowledgeBaseUid,
  );
  return knowledgeBase ? knowledgeBase.id : "Select";
};

export const getKnowledgeBaseUidByName = (
  knowledgeBaseName: string,
  knowledgeBases: KnowledgeBase[] | undefined,
): string | undefined => {
  const knowledgeBase = knowledgeBases?.find(
    (kb) => kb.name === knowledgeBaseName,
  );
  return knowledgeBase?.knowledgeBaseUid;
};

export const getFileTypeByExtension = (extension: string) => {
  switch (extension) {
    case "txt":
      return "TYPE_TEXT";
    case "md":
    case "markdown":
      return "TYPE_MARKDOWN";
    case "csv":
      return "TYPE_CSV";
    case "pdf":
      return "TYPE_PDF";
    case "docx":
      return "TYPE_DOCX";
    case "doc":
      return "TYPE_DOC";
    case "pptx":
      return "TYPE_PPTX";
    case "ppt":
      return "TYPE_PPT";
    case "html":
      return "TYPE_HTML";
    case "xls":
      return "TYPE_XLS";
    case "xlsx":
      return "TYPE_XLSX";
    default:
      return "TYPE_UNSPECIFIED";
  }
};
