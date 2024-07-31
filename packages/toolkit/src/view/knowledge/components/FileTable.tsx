import React from "react";
import { File, FileStatus } from "../../../../../sdk/src/knowledge/types";
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
        const statusOrder = {
            NOTSTARTED: 0,
            WAITING: 1,
            CONVERTING: 2,
            CHUNKING: 3,
            EMBEDDING: 4,
            COMPLETED: 5,
            FAILED: 6,
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
                aValue = getStatusSortValue(
                    a.processStatus.replace("FILE_PROCESS_STATUS_", "") as FileStatus
                );
                bValue = getStatusSortValue(
                    b.processStatus.replace("FILE_PROCESS_STATUS_", "") as FileStatus
                );
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
