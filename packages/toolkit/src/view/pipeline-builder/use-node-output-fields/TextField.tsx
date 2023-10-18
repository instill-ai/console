import { Nullable } from "../../../lib";
import { CopyToClipboardButton } from "../../../components";
import { ConnectorNodeFieldRoot, EndNodeFieldRoot } from "./FieldRoot";

export type TextFieldProps = {
  nodeType: "end" | "connector";
  title: Nullable<string>;
  text: Nullable<string>;
};

export const TextField = (props: TextFieldProps) => {
  const { nodeType, title, text } = props;

  if (nodeType === "connector") {
    return (
      <ConnectorNodeFieldRoot title={title} key={`${title}-field`}>
        <div className="flex p-2 relative w-full rounded-sm border border-semantic-bg-line flex-row justify-between gap-x-2">
          <pre className="min-h-[36px] whitespace-pre-line max-w-[480px] break-all flex flex-1 text-semantic-fg-primary product-body-text-4-regular">
            {text}
          </pre>
          {text ? (
            <CopyToClipboardButton
              className="!absolute !right-2 !top-2 !px-1 !py-1"
              text={text}
            />
          ) : null}
        </div>
      </ConnectorNodeFieldRoot>
    );
  }

  return (
    <EndNodeFieldRoot title={title} key={`${title}-field`}>
      <div className="flex p-2 relative w-full rounded-sm border border-semantic-bg-line flex-row justify-between gap-x-2">
        <pre className="min-h-[36px] whitespace-pre-line max-w-[480px] break-all flex flex-1 text-semantic-fg-primary product-body-text-4-regular">
          {text}
        </pre>
        {text ? (
          <CopyToClipboardButton
            className="!absolute !right-2 !top-2 !px-1 !py-1"
            text={text}
          />
        ) : null}
      </div>
    </EndNodeFieldRoot>
  );
};
