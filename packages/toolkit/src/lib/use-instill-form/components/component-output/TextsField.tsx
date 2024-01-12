import { Nullable } from "../../../type";
import { ComponentOutputFieldBaseProps } from "../../type";
import { FieldRoot } from "./FieldRoot";
import { MDTextViewer } from "./MDTextViewer";

export type TextsFieldProps = {
  texts: Nullable<string>[];
} & ComponentOutputFieldBaseProps;

export const TextsField = ({
  title,
  texts,
  hideField,
  componentID,
  enabledReferenceHint,
  path,
  instillFormat,
}: TextsFieldProps) => {
  const normalizedTexts = texts?.map((text) => String(text));

  return (
    <FieldRoot
      title={title}
      fieldKey={`${title}-field`}
      componentID={componentID}
      enabledReferenceHint={enabledReferenceHint}
      path={path}
      instillFormat={instillFormat}
    >
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
