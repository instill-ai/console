import * as React from "react";
import cn from "clsx";
import remarkFrontmatter from "remark-frontmatter";
import ReactMarkdown from "react-markdown";
import { Nullable } from "@instill-ai/toolkit";

import { NoBgSquareProgress } from "@instill-ai/design-system";

export type ModelReadmeMarkdownProps = {
  markdown: Nullable<string>;
  isLoading: boolean;
  className?: string;
};

export const ModelReadmeMarkdown = ({
  markdown,
  isLoading,
  className,
}: ModelReadmeMarkdownProps) => {
  return (
    <div
      className={cn(
        "border-instillGrey20 flex w-full flex-col border bg-white p-5",
        { "min-h-[200px]": !markdown || isLoading },
        className,
      )}
    >
      {isLoading ? (
        <div className="bg-instillBlue10 m-auto flex h-[72px] w-[72px]">
          <NoBgSquareProgress
            isLoading={true}
            blockSize={52}
            position="m-auto"
          />
        </div>
      ) : markdown && markdown !== "" ? (
        <div className="markdown-body">
          <ReactMarkdown remarkPlugins={[remarkFrontmatter]}>
            {markdown}
          </ReactMarkdown>
        </div>
      ) : (
        <React.Fragment>
          <h3 className="text-instillGrey90 text-instill-h3 mx-auto mt-auto">
            There is no Model card
          </h3>
          <p className="mx-auto mb-auto text-semantic-node-disconnected-default-stroke text-instill-body">
            You can add a README.md to describe the model.
          </p>
        </React.Fragment>
      )}
    </div>
  );
};
