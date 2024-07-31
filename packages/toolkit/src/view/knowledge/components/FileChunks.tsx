import React from "react";
import { Icons, Nullable } from "@instill-ai/design-system";
import { useGetFileContent, useListChunks } from "../../../lib/react-query-service/knowledge";
import { Chunk, KnowledgeBase, KnowledgeFile } from "../../../lib/vdp-sdk/knowledge/types";
import ChunkCard from "./ChunkCard";

type FileChunksProps = {
    file: KnowledgeFile;
    knowledgeBase: KnowledgeBase;
    accessToken: Nullable<string>;
    expanded: boolean;
    onToggleExpand: (fileUid: string) => void;
    onChunkClick: (file: KnowledgeFile, chunk: Chunk) => void;
    onRetrievableToggle: (
        chunkUid: string,
        currentValue: boolean,
    ) => Promise<void>;
};

const FileChunks: React.FC<FileChunksProps> = ({
    file,
    knowledgeBase,
    accessToken,
    expanded,
    onToggleExpand,
    onChunkClick,
    onRetrievableToggle,
}) => {
    const { data: chunks, isLoading: isLoadingChunks } = useListChunks({
        kbId: knowledgeBase.kbId,
        accessToken: accessToken || null,
        enabled: expanded,
        ownerId: knowledgeBase.ownerName,
        fileUid: file.fileUid,
    });

    const { data: fileContent } = useGetFileContent({
        fileUid: file.fileUid,
        kbId: knowledgeBase.kbId,
        accessToken: accessToken || null,
        enabled: expanded,
        ownerId: knowledgeBase.ownerName,
    });
    return (
        <div className="mb-4">
            <div
                className="mb-4 flex cursor-pointer items-center space-x-2"
                onClick={() => onToggleExpand(file.fileUid)}
            >
                <Icons.ChevronDown
                    className={`h-4 w-4 stroke-semantic-fg-primary transition-transform ${expanded ? "" : "-rotate-90"}`}
                />
                <p className={`text-${isLoadingChunks ? 'text-semantic-fg-disabled' : 'text-semantic-fg-secondary'} font-semibold text-[16px] leading-4 mr-6`}>
                    {file.name}
                </p>
                {isLoadingChunks && (
                    <p className="text-semantic-fg-secondary italic">Processing file...</p>
                )}
            </div>
            {expanded && !isLoadingChunks && chunks && chunks.length > 0 && (
                <div className="grid grid-cols-[repeat(auto-fit,360px)] justify-start gap-[15px]">
                    {chunks.map((chunk: Chunk, i: number) => (
                        <ChunkCard
                            key={chunk.chunkUid}
                            chunk={chunk}
                            index={i}
                            onChunkClick={() => onChunkClick(file, chunk)}
                            onRetrievableToggle={onRetrievableToggle}
                            fileContent={fileContent || ""}
                        />
                    ))}
                </div>
            )}
        </div>

    );
};

export default FileChunks;