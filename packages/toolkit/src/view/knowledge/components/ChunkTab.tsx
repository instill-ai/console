import React from 'react';
import { Chunk, KnowledgeBase, File } from "../../../lib/vdp-sdk/knowledge/types";
import { useGetFileContent, useListChunks, useListKnowledgeBaseFiles, useUpdateChunk } from '../../../lib/react-query-service/knowledge';
import { InstillStore, useInstillStore, useShallow } from "../../../lib";
import FileDetailsOverlay from './FileDetailsOverlay';
import { Icons, Separator, Skeleton } from '@instill-ai/design-system';
import ChunkCard from './ChunkCard';

type ChunkTabProps = {
  knowledgeBase: KnowledgeBase;
};

export const ChunkTab = ({ knowledgeBase }: ChunkTabProps) => {
  const [expandedFiles, setExpandedFiles] = React.useState<string[]>([]);
  const [selectedChunk, setSelectedChunk] = React.useState<Chunk | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isFileDetailsOpen, setIsFileDetailsOpen] = React.useState(false);

  const { accessToken } = useInstillStore(
    useShallow((store: InstillStore) => ({
      accessToken: store.accessToken,
    }))
  );

  const { data: files, isLoading: isLoadingFiles } = useListKnowledgeBaseFiles({
    ownerId: knowledgeBase.ownerName,
    knowledgeBaseId: knowledgeBase.kbId,
    accessToken,
    enabled: true,
  });

  const updateChunkMutation = useUpdateChunk();

  React.useEffect(() => {
    if (files && files.length > 0) {
      setExpandedFiles([files[0].fileUid]);
    }
  }, [files]);

  const toggleFileExpansion = (fileUid: string) => {
    setExpandedFiles(prev =>
      prev.includes(fileUid)
        ? prev.filter(id => id !== fileUid)
        : [...prev, fileUid]
    );
  };

  const handleChunkClick = (file: File, chunk: Chunk) => {
    setSelectedFile(file);
    setSelectedChunk(chunk);
    setIsFileDetailsOpen(true);
  };

  const closeOverlay = () => {
    setSelectedFile(null);
    setSelectedChunk(null);
    setIsFileDetailsOpen(false);
  }

  const handleRetrievableToggle = async (chunkUid: string, currentValue: boolean) => {
    try {
      await updateChunkMutation.mutateAsync({
        chunkUid,
        accessToken,
        retrievable: !currentValue,
      });
    } catch (error) {
      console.error("Failed to update chunk retrievable status:", error);
    }
  };

  return (
<div className="flex-col">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-semantic-fg-primary product-headings-heading-2">
          {knowledgeBase.name}
        </p>
      </div>
      <Separator orientation="horizontal" className="mb-6" />
      {isLoadingFiles ? (
        <div className="grid gap-16 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex h-[175px] w-[360px] flex-col rounded-md border border-semantic-bg-line bg-semantic-bg-primary p-5 shadow"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32 rounded bg-semantic-bg-line" />
                <Skeleton className="h-6 w-6 rounded bg-semantic-bg-line" />
              </div>
              <Separator orientation="horizontal" className="my-[10px]" />
              <div className="flex-1">
                <Skeleton className="mb-2 h-4 w-full rounded bg-semantic-bg-line" />
                <Skeleton className="h-4 w-2/3 rounded bg-semantic-bg-line" />
              </div>
              <div className="flex items-end justify-end">
                <Skeleton className="h-8 w-8 rounded bg-semantic-bg-line" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        files && files.length > 0 ? (
          <div className="flex">
            <div className="w-full pr-4">
              {files.map((file: File) => (
                <FileChunks
                  key={file.fileUid}
                  file={file}
                  knowledgeBase={knowledgeBase}
                  accessToken={accessToken}
                  expanded={expandedFiles.includes(file.fileUid)}
                  onToggleExpand={toggleFileExpansion}
                  onChunkClick={handleChunkClick}
                  onRetrievableToggle={handleRetrievableToggle}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Icons.DownloadCloud01 className="h-16 w-16 stroke-semantic-warning-default mb-4" />
            <p className="text-lg font-semibold mb-2">No files found</p>
            <p className="text-semantic-fg-secondary">
              Oops… It looks like you haven't uploaded any documents yet. Please go to the Upload Documents page to upload and process your files.
            </p>
          </div>
        )
      )}
      {selectedFile && selectedChunk && (
        <FileDetailsOverlay
          fileUid={selectedFile.fileUid}
          kbId={knowledgeBase.kbId}
          accessToken={accessToken}
          onClose={closeOverlay}
          showFullFile={true}
          selectedChunkUid={selectedChunk.chunkUid}
          ownerId={knowledgeBase.ownerName}
          isOpen={isFileDetailsOpen}
          setIsOpen={setIsFileDetailsOpen}
          fileName={selectedFile.name}
          highlightChunk={true}
          fileType={selectedFile.type}
        />
      )}
    </div>
  );
};

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
