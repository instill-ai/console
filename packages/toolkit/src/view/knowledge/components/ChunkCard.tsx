import * as React from "react";
import { Icons, Switch, Tag } from "@instill-ai/design-system";
import { Chunk } from "../../../lib/vdp-sdk/knowledge/types";

type ChunkCardProps = {
  chunk: Chunk;
  index: number;
  onChunkClick: () => void;
  onRetrievableToggle: (chunkUid: string, currentValue: boolean) => Promise<void>;
  fileContent: string;
};

const ChunkCard: React.FC<ChunkCardProps> = ({
  chunk,
  index,
  onChunkClick,
  onRetrievableToggle,
  fileContent,
}) => {

  const chunkContent = React.useMemo(() => {
    if (chunk.startPos !== undefined && chunk.endPos !== undefined) {
      return fileContent.slice(chunk.startPos, chunk.endPos);
    }
    return "Chunk content not available";
  }, [chunk, fileContent]);

  return (
    <div
      className="flex flex-col gap-y-2.5 rounded-md border border-semantic-bg-line bg-semantic-bg-primary p-2.5 cursor-pointer shadow-sm"
      onClick={onChunkClick}
    >
      <div className="flex flex-col gap-y-2.5 p-2.5">
        <div className="flex justify-between">
          <Tag size="sm" variant="default" className="!rounded border-semantic-bg-line bg-semantic-bg-base-bg border items-center">
            <Icons.Hash2 className="mr-0.5 h-5 w-5 stroke-semantic-fg-primary" />
            <span className="product-body-text-3-medium">
              {String(index + 1).padStart(3, "0")}
            </span>
          </Tag>
          <div
            className="flex items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="uppercase product-label-label-1 text-semantic-node-disconnected-selected-stroke">
              {chunk.retrievable ? "Retrievable" : "Unretrievable"}
            </span>
            <Switch
              checked={chunk.retrievable}
              onCheckedChange={() =>
                onRetrievableToggle(chunk.chunkUid, chunk.retrievable)
              }
              className=""
            />
          </div>
        </div>
        <div className="h-px w-full bg-semantic-bg-line" />
        <p className="text-semantic-fg-secondary-alt-secondary truncate product-body-text-2-regular hover:bg-semantic-bg-secondary">
          {chunkContent}
        </p>
        {/* <div className="flex items-center justify-end gap-1">
          <Tag size="sm" variant="lightNeutral" className="!rounded">
            <Icons.Type01 className="mr-1 h-2.5 w-2.5 stroke-semantic-fg-primary" />
            <span className="text-semantic-fg-primary product-body-text-3-medium">
              {chunk.tokens}
            </span>
          </Tag>
        </div> */}
      </div>
    </div>
  );
};

export default ChunkCard;
