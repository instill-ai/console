"use client";

import { CodeBlock, CopyToClipboardButton } from "../../../..";
import { GeneralRecord, Nullable } from "../../../type";
import { ComponentOutputFieldBaseProps } from "../../types";
import { FieldRoot } from "./FieldRoot";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";

export type ObjectsFieldProps = {
  objects: Nullable<GeneralRecord[]>;
} & ComponentOutputFieldBaseProps;

export const ObjectsField = (props: ObjectsFieldProps) => {
  const { title, objects, hideField } = props;

  return (
    <FieldRoot title={title} fieldKey={`${title}-field`}>
      {objects && !hideField ? (
        <div className="flex w-full flex-col flex-wrap gap-2">
          {objects?.map((object) => (
            <div
              key={`${title}-${JSON.stringify(object)}-field`}
              className="relative flex min-h-[36px] w-full whitespace-pre-wrap break-all rounded text-semantic-fg-primary product-body-text-4-regular"
            >
              <div className="absolute right-3 top-3">
                <CopyToClipboardButton
                  className="border-0 !bg-[#1E1E1E] !px-1 !py-1"
                  text={JSON.stringify(object, null, 4)}
                  iconClassName="!stroke-[#FFFFFF]"
                />
              </div>
              <SyntaxHighlighter
                language="json"
                style={vs2015}
                className="w-full rounded"
              >
                {`${JSON.stringify(object, null, 4)}`}
              </SyntaxHighlighter>
            </div>
          ))}
        </div>
      ) : null}
    </FieldRoot>
  );
};
