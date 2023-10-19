import { Nullable } from "../../../lib";
import { CopyToClipboardButton } from "../../../components";
import { ConnectorNodeFieldRoot, EndNodeFieldRoot } from "./FieldRoot";

export type TextsFieldProps = {
  nodeType: "end" | "connector";
  title: Nullable<string>;
  texts: Nullable<string>[];
};

export const TextsField = (props: TextsFieldProps) => {
  const { nodeType, title, texts } = props;

  if (nodeType === "connector") {
    <ConnectorNodeFieldRoot title={title} key={`${title}-field`}>
      <div className="flex w-full flex-col flex-wrap gap-2">
        {texts?.map((text) => (
          <div
            key={`${title}-${text}-field`}
            className="flex w-full p-2 relative border rounded-sm border-semantic-bg-line flex-row justify-between gap-x-2"
          >
            <pre className="min-h-[16px] whitespace-pre-line max-w-[480px] break-all flex flex-1 text-semantic-fg-primary product-body-text-4-regular">
              {text}
            </pre>
            {text ? (
              <CopyToClipboardButton
                className="!absolute !right-2 !top-2 !px-1 !py-1"
                text={text}
              />
            ) : null}
          </div>
        ))}
      </div>
    </ConnectorNodeFieldRoot>;
  }

  return (
    <EndNodeFieldRoot title={title} key={`${title}-field`}>
      <div className="flex-row flex-wrap gap-2">
        {texts?.map((text) => (
          <div
            key={`${title}-${text}-field`}
            className="flex w-full p-2 border border-semantic-bg-line rounded-sm relative flex-row justify-between gap-x-2"
          >
            <pre className="min-h-[16px] whitespace-pre-line max-w-[480px] break-all flex flex-1 text-semantic-fg-primary product-body-text-4-regular">
              {text}
            </pre>
            {text ? (
              <CopyToClipboardButton
                className="!absolute !right-2 !top-2 !px-1 !py-1"
                text={text}
              />
            ) : null}
          </div>
        ))}
      </div>
    </EndNodeFieldRoot>
  );
};
