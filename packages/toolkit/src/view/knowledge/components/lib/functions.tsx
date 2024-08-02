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
    default:
      return <Icons.Check className="h-5 w-5" />;
  }
};

export const truncateName = (name: string, maxLength: number = 20) => {
  if (name.length <= maxLength) return name;
  return `${name.slice(0, maxLength)}...`;
};