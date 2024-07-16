import React from 'react';
import { KnowledgeBase, File, Chunk } from "../../../lib/vdp-sdk/knowledge/types";
import { useListKnowledgeBaseFiles, useListChunks } from '../../../lib/react-query-service/knowledge';
import { InstillStore, useInstillStore, useShallow } from "../../../lib";
import FileDetailsOverlay from './FileDetailsOverlay';
import { Icons, Tag, Switch, Separator, Skeleton } from '@instill-ai/design-system';
import { useQueries, useQuery } from "@tanstack/react-query";

type ChunkTabProps = {
  knowledgeBase: KnowledgeBase;
};

export const ChunkTab = ({ knowledgeBase }: ChunkTabProps) => {
  const [expandedFiles, setExpandedFiles] = React.useState<string[]>([]);
  const [selectedChunk, setSelectedChunk] = React.useState<{ fileUid: string; chunkUid: string } | null>(null);
  const [isFileDetailsOpen, setIsFileDetailsOpen] = React.useState(false);

  const { accessToken, enabledQuery } = useInstillStore(
    useShallow((store: InstillStore) => ({
      accessToken: store.accessToken,
      enabledQuery: store.enabledQuery,
    }))
  );

  const { data: files, isLoading: isLoadingFiles } = useListKnowledgeBaseFiles({
    ownerId: knowledgeBase.ownerName,
    knowledgeBaseId: knowledgeBase.kbId,
    accessToken,
    enabled: enabledQuery,
  });

  React.useEffect(() => {
    if (files && files.length > 0) {
      setExpandedFiles([files[0].fileUid]);
    }
  }, [files]);

  const chunkQueries = useQueries({
    queries: (files || []).map(file => ({
      queryKey: ['chunks', knowledgeBase.kbId, file.fileUid],
      queryFn: () => useListChunks({
        kbId: knowledgeBase.kbId,
        accessToken,
        enabled: true,
        ownerId: knowledgeBase.ownerName,
        fileUid: file.fileUid,
      }).queryFn(),
      enabled: !!files,
    })),
  });

  const isLoading = isLoadingFiles || chunkQueries.some(query => query.isLoading);

  const toggleFileExpansion = (fileUid: string) => {
    setExpandedFiles(prev =>
      prev.includes(fileUid)
        ? prev.filter(id => id !== fileUid)
        : [...prev, fileUid]
    );
  };

  const handleChunkClick = (fileUid: string, chunkUid: string) => {
    setSelectedChunk({ fileUid, chunkUid });
    setIsFileDetailsOpen(true);
  };

  const closeOverlay = () => {
    setSelectedChunk(null);
    setIsFileDetailsOpen(false);
  };

  const chunksByFile = React.useMemo(() => {
    const result: Record<string, Chunk[]> = {};
    chunkQueries.forEach((query, index) => {
      const file = files?.[index];
      if (file && query.data) {
        result[file.fileUid] = query.data;
      }
    });
    return result;
  }, [chunkQueries, files]);

  return (
    <div className="flex-col">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-2xl font-bold text-semantic-fg-primary product-headings-heading-1">
          {knowledgeBase.name}
        </p>
      </div>
      <Separator orientation="horizontal" className="mb-6" />
      {isLoading ? (
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
        <div className="flex">
          <div className="w-full pr-4">
            {files?.map((file) => (
              <div key={file.fileUid} className="mb-4">
                <div
                  className="mb-2 flex cursor-pointer items-center space-x-2"
                  onClick={() => toggleFileExpansion(file.fileUid)}
                >
                  <p className="product-button-button-1">{file.name}</p>
                  <Icons.ChevronDown
                    className={`h-4 w-4 stroke-semantic-fg-primary transition-transform ${expandedFiles.includes(file.fileUid) ? "rotate-180" : ""
                      }`}
                  />
                </div>
                {expandedFiles.includes(file.fileUid) && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {chunksByFile[file.fileUid]?.map((chunk: Chunk, i: number) => (
                      <div
                        key={chunk.chunkUid}
                        className="flex flex-col gap-y-2.5 rounded-md border border-semantic-bg-line bg-semantic-bg-primary p-2.5 w-[360px]"
                        onClick={() => handleChunkClick(file.fileUid, chunk.chunkUid)}
                      >
                        <div className="flex flex-col gap-y-2.5 p-2.5">
                          <div className="flex items-center justify-between">
                            <Tag size="sm" variant="default" className="!rounded">
                              <span className="mr-1.5 product-body-text-3-medium">
                                {String(i + 1).padStart(3, "0")}
                              </span>
                            </Tag>
                            <div className="flex items-center gap-1">
                              <span className="uppercase product-label-label-1">
                                {chunk.retrievable ? "Retrievable" : "Unretrievable"}
                              </span>
                              <Switch
                                checked={chunk.retrievable}
                                onCheckedChange={() => { }}
                                className=""
                              />
                            </div>
                          </div>
                          <div className="h-px w-full bg-semantic-bg-line" />
                          <p className="text-semantic-fg-secondary-alt-secondary line-clamp-3 product-body-text-2-regular">
                            {chunk.content}
                          </p>
                          <div className="flex items-center justify-end gap-1">
                            <Tag
                              size="sm"
                              variant="lightNeutral"
                              className="!rounded"
                            >
                              <Icons.Type01 className="mr-1 h-2.5 w-2.5 stroke-semantic-fg-primary" />
                              <span className="text-semantic-fg-primary product-body-text-3-medium">
                                {chunk.tokens}
                              </span>
                            </Tag>
                            <Tag
                              size="sm"
                              variant="lightNeutral"
                              className="!rounded"
                            >
                              <Icons.Type01 className="mr-1 h-2.5 w-2.5 stroke-semantic-fg-primary" />
                              <span className="text-semantic-fg-primary product-body-text-3-medium">
                                {chunk.chunkUid.slice(-8)}
                              </span>
                            </Tag>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {selectedChunk && (
        <FileDetailsOverlay
          fileUid={selectedChunk.fileUid}
          kbId={knowledgeBase.kbId}
          accessToken={accessToken}
          onClose={closeOverlay}
          showFullFile={true}
          selectedChunkUid={selectedChunk.chunkUid}
          ownerId={knowledgeBase.ownerName}
          isOpen={isFileDetailsOpen}
          setIsOpen={setIsFileDetailsOpen}
        />
      )}
    </div>
  );
};