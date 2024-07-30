import React from "react";
import { Icons, Skeleton } from "@instill-ai/design-system";
import { useGetFileContent, useListChunks } from "../../../lib/react-query-service/knowledge";
import { Chunk, KnowledgeBase, KnowledgeFile } from "../../../lib/vdp-sdk/knowledge/types";
import ChunkCard from "./ChunkCard";
import { Nullable } from "vitest";

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
                    className={`h-4 w-4 stroke-semantic-fg-primary transition-transform ${expanded ? "" : "-rotate-90"
                        }`}
                />
                <p className="text-semantic-fg-secondary font-semibold text-[16px] leading-4">{file.name}</p>
            </div>
            {expanded ? (
                <div className="grid grid-cols-[repeat(auto-fit,360px)] justify-start gap-[15px]">
                    {isLoadingChunks ? (
                        <Skeleton className="h-32 w-full" />
                    ) : chunks && chunks.length > 0 ? (
                        chunks.map((chunk: Chunk, i: number) => (
                            <ChunkCard
                                key={chunk.chunkUid}
                                chunk={chunk}
                                index={i}
                                onChunkClick={() => onChunkClick(file, chunk)}
                                onRetrievableToggle={onRetrievableToggle}
                                fileContent={fileContent || ""}
                            />
                        ))
                    ) : (
                        <div className="col-span-3 flex flex-col items-center justify-center p-8 text-center">
                            <Icons.Gear01 className="h-12 w-12 stroke-semantic-warning-default mb-4" />
                            <p className="text-semantic-fg-secondary">
                                Oops… It looks like your files are still being processed. Please
                                check back later to see the chunks.
                            </p>
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
};

export default FileChunks;