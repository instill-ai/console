import { Nullable } from "../../../type";
import { FieldRoot } from "./FieldRoot";
import { MDTextViewer } from "./MDTextViewer";

export type TextsFieldProps = {
  title: Nullable<string>;
  texts: Nullable<string>[];
  hideField?: boolean;
};

export const TextsField = (props: TextsFieldProps) => {
  const { title, texts, hideField } = props;

  const normalizedTexts = texts?.map((text) => String(text));

  return (
    <FieldRoot title={title} key={`${title}-field`}>
      {normalizedTexts && !hideField ? (
        <div className="flex w-full flex-col flex-wrap gap-2">
          {normalizedTexts.map((text) => (
            <MDTextViewer key={`${title}-${text}-field`} text={text} />
          ))}
        </div>
      ) : null}
    </FieldRoot>
  );
};
