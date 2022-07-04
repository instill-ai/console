import { FC } from "react";
import ReactMarkdown from "react-markdown";
import cn from "clsx";
import { NoBgSquareProgress } from "@instill-ai/design-system";
import "../../../styles/github-markdown.css";

export type ModelInstanceReadmeCardProps = {
  markdown: string;
  marginBottom: string;
  isLoading: boolean;
};

const ModelInstanceReadmeCard: FC<ModelInstanceReadmeCardProps> = ({
  markdown,
  isLoading,
  marginBottom,
}) => {
  return (
    <div
      className={cn(
        "flex min-h-[200px] w-full flex-col border border-instillGrey20 bg-white p-5",
        marginBottom
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
      ) : markdown ? (
        <div className="markdown-body">
          <ReactMarkdown>{markdown}</ReactMarkdown>
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

export default ModelInstanceReadmeCard;
