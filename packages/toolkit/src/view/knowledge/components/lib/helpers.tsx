import { Icons } from "@instill-ai/design-system";

import { FileStatus } from "../../../../lib/react-query-service/knowledge/types";

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
    case "FILE_TYPE_WORD":
      return <Icons.DOCFile className="h-5 w-5" />;
    case "FILE_TYPE_DOCX":
      return <Icons.DOCXFile className="h-5 w-5" />;
    case "FILE_TYPE_POWERPOINT":
      return <Icons.PPTFile className="h-5 w-5" />;
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
      return "FILE_TYPE_PPTX"
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
    case "FILE_TYPE_WORD":
      return "docx";
    case "FILE_TYPE_POWERPOINT":
      return "pptx";
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

export const getPlanMaxFileSize = (plan: string): number => {
  switch (plan) {
    case "PLAN_FREEMIUM":
      return 15 * 1024 * 1024; // 15MB
    case "PLAN_TEAM":
    case "PLAN_TEAM_PRO":
    case "PLAN_ENTERPRISE":
      return 150 * 1024 * 1024; // 150MB
    default:
      return 15 * 1024 * 1024; // Default to 15MB
  }
};

export const getPlanStorageLimit = (plan: string): number => {
  switch (plan) {
    case "PLAN_FREEMIUM":
      return 50 * 1024 * 1024; // 50MB
    case "PLAN_TEAM_PRO":
      return 500 * 1024 * 1024; // 500MB
    case "PLAN_TEAM":
      return 2 * 1024 * 1024 * 1024; // 2GB
    case "PLAN_ENTERPRISE":
      return Infinity; // Unlimited
    default:
      return 50 * 1024 * 1024; // Default to 50MB
  }
};

export const getPlanStorageLimitMB = (size: number): string => {
  return (size / (1024 * 1024)).toFixed(2);
}

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

export const getKnowledgeBaseLimit = (plan: string) => {
  switch (plan) {
    case "PLAN_FREEMIUM":
      return 10;
    case "PLAN_TEAM":
      return 300;
    case "PLAN_TEAM_PRO":
    case "PLAN_ENTERPRISE":
      return 500;
    default:
      return 10;
  }
};