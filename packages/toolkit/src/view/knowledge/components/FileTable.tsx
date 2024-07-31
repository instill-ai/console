import React from "react";
import { File, FileStatus } from "../../../lib/react-query-service/knowledge/types";
import { FileTableRow } from "./FileTableRow";
import { FileTableHeader } from "./FileTableHeader";

type FileTableProps = {
    files: File[];
    sortConfig: {
        key: keyof File | "";
        direction: "ascending" | "descending" | "";
    };
    requestSort: (key: keyof File) => void;
    handleDelete: (fileUid: string) => void;
    handleFileClick: (file: File) => void;
    fileToDelete: File | null;
};

export const FileTable: React.FC<FileTableProps> = ({
    files,
    sortConfig,
    requestSort,
    handleDelete,
    handleFileClick,
    fileToDelete,
}) => {
    const getStatusSortValue = (status: FileStatus): number => {
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

    const sortedData = React.useMemo(() => {
        if (!files) return [];
        return [...files].sort((a, b) => {
            if (sortConfig.key === "") return 0;

            let aValue: string | number | Date | boolean = a[sortConfig.key];
            let bValue: string | number | Date | boolean = b[sortConfig.key];

            if (sortConfig.key === "processStatus") {
                aValue = getStatusSortValue(a.processStatus as FileStatus);
                bValue = getStatusSortValue(b.processStatus as FileStatus);
            } else if (
                sortConfig.key === "size" ||
                sortConfig.key === "totalChunks" ||
                sortConfig.key === "totalTokens"
            ) {
                aValue = Number(aValue);
                bValue = Number(bValue);
            } else if (sortConfig.key === "createTime") {
                aValue = new Date(aValue as string);
                bValue = new Date(bValue as string);
            }

            if (aValue < bValue) {
                return sortConfig.direction === "ascending" ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === "ascending" ? 1 : -1;
            }
            return 0;
        });
    }, [files, sortConfig]);

    return (
        <div className="flex flex-col">
            <FileTableHeader sortConfig={sortConfig} requestSort={requestSort} />
            {sortedData
                .filter((item) => item.fileUid !== fileToDelete?.fileUid)
                .map((item, index) => (
                    <FileTableRow
                        key={item.fileUid}
                        item={item}
                        index={index}
                        handleFileClick={handleFileClick}
                        handleDelete={handleDelete}
                    />
                ))}
        </div>
    );
};