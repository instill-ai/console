import { Dispatch, FC, SetStateAction } from "react";
import cn from "clsx";
import { CodeBlock } from "react-code-blocks";

export type TestModelInstanceResultBlockProps = {
  result: string;
  width: string;
  blockIsOpen: boolean;
  setBlockIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const TestModelInstanceResultBlock: FC<
  TestModelInstanceResultBlockProps
> = ({ result, width, blockIsOpen, setBlockIsOpen }) => {
  return (
    <div className={cn("flex flex-col bg-white", width)}>
      <div className="flex flex-row p-2.5">
        <p className="my-auto mr-auto text-instillGrey90 text-instill-body">
          Testing result
        </p>
        <button
          className="flex bg-instillGrey05 py-[5px] px-2.5"
          onClick={() => {
            setBlockIsOpen((prev) => !prev);
          }}
        >
          {blockIsOpen ? "↑" : "↓"}
        </button>
      </div>
      {blockIsOpen ? (
        <div className="w-full bg-white">
          <CodeBlock
            text={result}
            language="json"
            theme="googlecode"
            showLineNumbers={false}
            customStyle={{
              backgroundColor: "white",
              fontFamily: "sans",
              fontSize: "14px",
              fontWeight: "400",
            }}
          />
        </div>
      ) : null}
    </div>
  );
};
