import { FC } from "react";
import ReactMarkdown from "react-markdown";
import cn from "clsx";
import remarkFrontmatter from "remark-frontmatter";
import { NoBgSquareProgress } from "@instill-ai/design-system";
import { Nullable } from "@instill-ai/toolkit";

export type ModelInstanceReadmeCardProps = {
  markdown: Nullable<string>;
  marginBottom: string;
  isLoading: boolean;
};

export const ModelInstanceReadmeCard: FC<ModelInstanceReadmeCardProps> = ({
  markdown,
  isLoading,
  marginBottom,
}) => {
  return (
    <div
      className={cn(
        "flex w-full flex-col border border-instillGrey20 bg-white p-5",
        marginBottom,
        { "min-h-[200px]": !markdown || isLoading }
      )}
    >
      {isLoading ? (
        <div className="m-auto flex h-[72px] w-[72px] bg-instillBlue10">
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
        <>
          <h3 className="mx-auto mt-auto text-instillGrey90 text-instill-h3">
            There is no Model card
          </h3>
          <p className="mx-auto mb-auto text-instillGrey50 text-instill-body">
            You can add a README.md to discribe the model.
          </p>
        </>
      )}
    </div>
  );
};
