import { NodeProps } from "reactflow";

import { Icons } from "@instill-ai/design-system";

import { ImageWithFallback } from "../../../../components";
import { GeneralNodeData } from "../../../pipeline-builder";

export const GeneralNode = ({ data }: NodeProps<GeneralNodeData>) => {
  return (
    <div className="w-20 border border-semantic-bg-line flex items-center justify-center h-20 rounded-md bg-semantic-bg-primary">
      <ImageWithFallback
        src={`/icons/${data.definition?.id}.svg`}
        width={32}
        height={32}
        alt={`${data.definition?.title}-icon`}
        fallbackImg={
          <Icons.Box className="my-auto h-8 w-8 stroke-semantic-fg-primary" />
        }
      />
    </div>
  );
};
