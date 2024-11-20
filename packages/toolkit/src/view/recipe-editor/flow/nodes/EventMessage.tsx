import type { Nullable } from "instill-sdk";
import * as React from "react";

import { CodeBlock } from "../../../../components";

export const EventMessage = ({
  id,
  messageSnippet,
  messageDataFirstDataKey,
}: {
  id: string;
  messageSnippet: string;
  messageDataFirstDataKey: Nullable<string>;
}) => {
  return (
    <div className="flex flex-col gap-y-1 w-full py-2">
      <div className="flex flex-col gap-y-2">
        <p className="product-body-text-1-semibold text-semantic-fg-primary">
          {id}
        </p>
        <p className=" product-body-text-4-regular">
          <span className="font-semibold text-semantic-fg-primary">
            Fake message data:
          </span>{" "}
          <span className="text-semantic-fg-disabled">
            This is the fake message of this event. Please paste the
            object&apos;s path in the recipe to use it.
          </span>{" "}
          {messageDataFirstDataKey ? (
            <React.Fragment>
              <span className="text-semantic-fg-disabled">for example:</span>{" "}
              <span className="font-semibold text-semantic-fg-primary">
                {"${" + `on.${id}.message.${messageDataFirstDataKey}` + "}"}
              </span>
            </React.Fragment>
          ) : null}
        </p>
      </div>
      <CodeBlock
        codeString={messageSnippet}
        wrapLongLines={true}
        language="bash"
        className="min-h-[288px]"
        customStyle={{
          borderRadius: "0.5rem",
          fontSize: "14px",
          backgroundColor: "white",
          width: "100%",
          maxWidth: "496px",
          padding: "48px 12px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
        }}
      />
    </div>
  );
};
