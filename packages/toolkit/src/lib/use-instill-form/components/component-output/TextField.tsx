import { CopyToClipboardButton } from "../../../../components";
import { Nullable } from "../../../type";
import { ConnectorNodeFieldRoot, EndNodeFieldRoot } from "./FieldRoot";

export type TextFieldProps = {
  nodeType: "end" | "connector";
  title: Nullable<string>;
  text: Nullable<string>;
  hideField?: boolean;
};

export const TextField = (props: TextFieldProps) => {
  const { nodeType, title, text, hideField } = props;

  if (nodeType === "connector") {
    return (
      <ConnectorNodeFieldRoot title={title} fieldKey={`${title}-field`}>
        {text && !hideField ? (
          <div className="relative flex w-full flex-row justify-between gap-x-2 rounded-sm border border-semantic-bg-line p-2">
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
        ) : null}
      </ConnectorNodeFieldRoot>
    );
  }

  return (
    <EndNodeFieldRoot title={title} key={`${title}-field`}>
      {text && !hideField ? (
        <div className="relative flex w-full flex-row justify-between gap-x-2 rounded-sm border border-semantic-bg-line p-2">
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
      ) : null}
    </EndNodeFieldRoot>
  );
};
