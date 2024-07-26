import { Icons, Switch, Tag } from "@instill-ai/design-system";

import { Chunk } from "../../../lib/vdp-sdk/knowledge/types";

type ChunkCardProps = {
  chunk: Chunk;
  index: number;
  onChunkClick: () => void;
  onRetrievableToggle: (
    chunkUid: string,
    currentValue: boolean,
  ) => Promise<void>;
  fileContent: string;
};

const ChunkCard = ({
  chunk,
  index,
  onChunkClick,
  onRetrievableToggle,
  fileContent,
}: ChunkCardProps) => {
  return (
    <div
      className="flex flex-col gap-y-2.5 rounded-md border border-semantic-bg-line bg-semantic-bg-primary p-2.5 w-[360px] cursor-pointer"
      onClick={onChunkClick}
    >
      <div className="flex flex-col gap-y-2.5 p-2.5">
        <div className="flex items-center justify-between">
          <Tag size="sm" variant="default" className="!rounded">
            <span className="mr-1.5 product-body-text-3-medium">
              {String(index + 1).padStart(3, "0")}
            </span>
          </Tag>
          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="uppercase product-label-label-1">
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
          {fileContent}
        </p>
        <div className="flex items-center justify-end gap-1">
          <Tag size="sm" variant="lightNeutral" className="!rounded">
            <Icons.Type01 className="mr-1 h-2.5 w-2.5 stroke-semantic-fg-primary" />
            <span className="text-semantic-fg-primary product-body-text-3-medium">
              {chunk.tokens}
            </span>
          </Tag>
        </div>
      </div>
    </div>
  );
};

export default ChunkCard;
