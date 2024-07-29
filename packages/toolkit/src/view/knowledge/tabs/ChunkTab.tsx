import React from 'react';
import { Chunk, KnowledgeBase, File } from "../../../../../sdk/src/vdp/artifact/types";
import { InstillStore, useInstillStore, useShallow } from "../../../lib";
import FileDetailsOverlay from '../components/FileDetailsOverlay';
import { Icons, Nullable, Separator, Skeleton } from '@instill-ai/design-system';
import FileChunks from '../components/FileChunks';

type ChunkTabProps = {
  knowledgeBase: KnowledgeBase;
};

const storeSelector = (store: InstillStore) => ({
  accessToken: store.accessToken,
});

export const ChunkTab: React.FC<ChunkTabProps> = ({ knowledgeBase }) => {
  const [expandedFiles, setExpandedFiles] = React.useState<string[]>([]);
  const [selectedChunk, setSelectedChunk] = React.useState<Nullable<Chunk>>(null);
  const [selectedFile, setSelectedFile] = React.useState<Nullable<File>>(null);
  const [isFileDetailsOpen, setIsFileDetailsOpen] = React.useState(false);

  const { accessToken } = useInstillStore(useShallow(storeSelector));

  const artifactClient = useArtifactClient();

  const knowledgeBaseFiles = artifactClient.useListKnowledgeBaseFiles({
    ownerId: knowledgeBase.ownerName,
    kbId: knowledgeBase.kbId,
    enabled: true,
    enablePagination: false,
  });

  React.useEffect(() => {
    if (knowledgeBaseFiles.data && knowledgeBaseFiles.data.length > 0) {
      setExpandedFiles([knowledgeBaseFiles.data[0].fileUid]);
    }
  }, [knowledgeBaseFiles.data]);

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
      await artifactClient.updateChunk({
        chunkUid,
        retrievable: !currentValue,
      });
      knowledgeBaseFiles.refetch();
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
      {knowledgeBaseFiles.isLoading ? (
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
        knowledgeBaseFiles.data && knowledgeBaseFiles.data.length > 0 ? (
          <div className="flex">
            <div className="w-full pr-4">
              {knowledgeBaseFiles.data.map((file: File) => (
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