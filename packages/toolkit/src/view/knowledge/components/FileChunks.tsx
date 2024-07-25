import { Icons, Skeleton } from "@instill-ai/design-system";
import { useGetFileContent, useListChunks } from "../../../lib/react-query-service/knowledge";
import { Chunk, KnowledgeBase } from "../../../../../sdk/src/vdp/artifact/types";
import ChunkCard from "./ChunkCard";

type FileChunksProps = {
    file: File;
    knowledgeBase: KnowledgeBase;
    accessToken: string | null;
    expanded: boolean;
    onToggleExpand: (fileUid: string) => void;
    onChunkClick: (fileUid: string, chunkUid: string) => void;
    onRetrievableToggle: (chunkUid: string, currentValue: boolean) => Promise<void>;
  };
  
  const FileChunks = ({
    file,
    knowledgeBase,
    accessToken,
    expanded,
    onToggleExpand,
    onChunkClick,
    onRetrievableToggle,
  }: FileChunksProps) => {
  
    const { data: chunks, isLoading: isLoadingChunks } = useListChunks({
      kbId: knowledgeBase.kbId,
      accessToken,
      enabled: expanded,
      ownerId: knowledgeBase.ownerName,
      fileUid: file.fileUid,
    });
  
    const { data: fileContent, isLoading: isLoadingFileContent } = useGetFileContent({
      fileUid: file.fileUid,
      kbId: knowledgeBase.kbId,
      accessToken,
      enabled: expanded,
      ownerId: knowledgeBase.ownerName,
    });
  
    return (
      <div className="mb-4">
        <div
          className="mb-2 flex cursor-pointer items-center space-x-2"
          onClick={() => onToggleExpand(file.fileUid)}
        >
          <p className="product-button-button-1">{file.name}</p>
          <Icons.ChevronDown
            className={`h-4 w-4 stroke-semantic-fg-primary transition-transform ${expanded ? "rotate-180" : ""
              }`}
          />
        </div>
        {expanded ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoadingChunks ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              chunks && chunks.length > 0 ? (
                chunks.map((chunk: Chunk, i: number) => (
                  <ChunkCard
                    key={chunk.chunkUid}
                    chunk={chunk}
                    index={i}
                    onChunkClick={() => onChunkClick(file, chunk)}
                    onRetrievableToggle={onRetrievableToggle}
                    fileContent={fileContent || ''}
                  />
                ))
              ) : (
                <div className="col-span-3 flex flex-col items-center justify-center p-8 text-center">
                  <Icons.Gear01 className="h-12 w-12 stroke-semantic-warning-default mb-4" />
                  <p className="text-semantic-fg-secondary">
                    Oops… It looks like your files are still being processed. Please check back later to see the chunks.
                  </p>
                </div>
              )
            )}
          </div>
        ) : null}
      </div>
    );
  };

  export default FileChunks;