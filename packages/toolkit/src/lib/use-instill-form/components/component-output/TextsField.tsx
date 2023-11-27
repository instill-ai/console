import { CopyToClipboardButton } from "../../../../components";
import { Nullable } from "../../../type";
import { ConnectorNodeFieldRoot, EndNodeFieldRoot } from "./FieldRoot";
import { MDTextViewer } from "./MDTextViewer";

export type TextsFieldProps = {
  nodeType: "end" | "connector";
  title: Nullable<string>;
  texts: Nullable<string>[];
  hideField?: boolean;
};

export const TextsField = (props: TextsFieldProps) => {
  const { nodeType, title, texts, hideField } = props;

  const normalizedText = texts?.map((text) => String(text));

  if (nodeType === "connector") {
    <ConnectorNodeFieldRoot title={title} fieldKey={`${title}-field`}>
      {normalizedText && !hideField ? (
        <div className="flex w-full flex-col flex-wrap gap-2">
          {normalizedText.map((text) => (
            <div
              key={`${title}-${text}-field`}
              className="relative flex w-full flex-row justify-between gap-x-2 rounded-sm border border-semantic-bg-line p-2"
            >
              <pre className="flex min-h-[36px] w-full flex-1 items-center whitespace-pre-line break-all text-semantic-fg-primary product-body-text-4-regular">
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
      ) : null}
    </ConnectorNodeFieldRoot>;
  }

  return (
    <EndNodeFieldRoot title={title} key={`${title}-field`}>
      {normalizedText && !hideField ? (
        <div className="flex w-full flex-col flex-wrap gap-2">
          {normalizedText.map((text) => (
            <MDTextViewer key={`${title}-${text}-field`} text={text} />
          ))}
        </div>
      ) : null}
    </EndNodeFieldRoot>
  );
};
