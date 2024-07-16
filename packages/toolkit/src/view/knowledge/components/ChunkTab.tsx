// ChunkTab.tsx
import React from 'react';
import { KnowledgeBase } from "../../../lib/vdp-sdk/knowledge/types";
import { useListChunks } from '../../../lib/react-query-service/knowledge';
import { InstillStore, useInstillStore, useShallow } from "../../../lib";
import FileDetailsOverlay from './FileDetailsOverlay';
import { Icons, Tag, Switch, Separator, Skeleton } from '@instill-ai/design-system';

type ChunkTabProps = {
  knowledgeBase: KnowledgeBase;
};

export const ChunkTab = ({ knowledgeBase }: ChunkTabProps) => {
  const [expandedFiles, setExpandedFiles] = React.useState<string[]>([]);
  const [selectedChunk, setSelectedChunk] = React.useState<{ fileUid: string; chunkUid: string } | null>(null);

  const { accessToken } = useInstillStore(
    useShallow((store: InstillStore) => ({
      accessToken: store.accessToken,
    }))
  );

  const { data: chunks, isLoading } = useListChunks({
    kbId: knowledgeBase.kbId,
    accessToken,
    enabled: true,
    ownerId: knowledgeBase.ownerName,
  });

  const toggleFileExpansion = (fileUid: string) => {
    setExpandedFiles(prev =>
      prev.includes(fileUid)
        ? prev.filter(id => id !== fileUid)
        : [...prev, fileUid]
    );
  };

  const handleChunkClick = (fileUid: string, chunkUid: string) => {
    setSelectedChunk({ fileUid, chunkUid });
  };

  const closeOverlay = () => {
    setSelectedChunk(null);
  };

  if (isLoading) return <div>Loading chunks...</div>;

  const chunksByFile = chunks?.reduce((acc, chunk) => {
    if (!acc[chunk.originalFileUid]) {
      acc[chunk.originalFileUid] = [];
    }
    acc[chunk.originalFileUid].push(chunk);
    return acc;
  }, {} as Record<string, typeof chunks>);

  return (

    <div className="flex-col">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-2xl font-bold text-semantic-fg-primary product-headings-heading-1">
          {knowledgeBase.name}
        </p>
        {/* <div className="space-x-4">
          <Button variant="secondaryGrey" size="lg">
            Publish
          </Button>
          <Button variant="secondaryGrey" size="lg">
            Update Knowledge Base
          </Button>
          <Button variant="primary" size="lg">
            Export Data
          </Button>
        </div> */}
      </div>
      <Separator orientation="horizontal" className="mb-6" />
      {loading ? (
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
            {/* <div className="mb-4 flex items-center space-x-2">
            <Button variant="secondaryGrey">
              <Icons.Plus className="mr-2 h-4 w-4 stroke-semantic-fg-secondary" />
              <span className="product-body-text-3-semibold">
                Add File Chunk
              </span>
            </Button>
            <Input.Root className="w-1/3">
              <Input.LeftIcon>
                <Icons.SearchSm className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
              </Input.LeftIcon>
              <Input.Core placeholder="Search..." />
            </Input.Root>
          </div> */}
            {Object.entries(chunksByFile || {}).map(([fileUid, fileChunks]) => (
              <div key={fileUid} className="mb-4">
                <div
                  className="mb-2 flex cursor-pointer items-center space-x-2"
                  onClick={() => toggleFileExpansion(fileUid)}
                >
                  <p className="product-button-button-1">{fileUid}</p>
                  <Icons.ChevronDown
                    className={`h-4 w-4 stroke-semantic-fg-primary transition-transform ${expandedFiles.includes(fileUid) ? "rotate-180" : ""
                      }`}
                  />
                </div>
                {expandedFiles.includes(fileUid) && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {fileChunks.map((chunk, i) => (
                      <div
                        key={chunk.chunkUid}
                        className="flex flex-col gap-y-2.5 rounded-md border border-semantic-bg-line bg-semantic-bg-primary p-2.5 w-[360px]"
                        onClick={() => handleChunkClick(fileUid, chunk.chunkUid)}
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
                            <Tag
                              size="sm"
                              variant="lightNeutral"
                              className="!rounded"
                            >
                              <Icons.Type01 className="mr-1 h-2.5 w-2.5 stroke-semantic-fg-primary" />
                              <span className="text-semantic-fg-primary product-body-text-3-medium">
                                2cfefe7706...
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
          {/* <div className="w-1/3">
          <MetadataPreview />
        </div> */}
        </div>
      )}
      {selectedChunk && (
        <FileDetailsOverlay
          fileUid={selectedChunk.fileUid}
          kbId={knowledgeBase.kbId}
          accessToken={accessToken}
          onClose={closeOverlay}
          showFullFile={false}
          selectedChunkUid={selectedChunk.chunkUid}
          ownerId={knowledgeBase.ownerName}
        />
      )}
    </div>
  );
};