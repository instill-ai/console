import { Nullable } from "../../../type";
import { ComponentOutputFieldBaseProps } from "../../type";
import { FieldRoot } from "./FieldRoot";
import { MDTextViewer } from "./MDTextViewer";

export type TextFieldProps = {
  text: Nullable<string>;
} & ComponentOutputFieldBaseProps;

export const TextField = ({
  title,
  text,
  hideField,
  componentID,
  enabledReferenceHint,
  path,
  instillFormat,
}: TextFieldProps) => {
  const normalizedText = text ? String(text) : null;

  return (
    <FieldRoot
      title={title}
      fieldKey={`${title}-field`}
      componentID={componentID}
      enabledReferenceHint={enabledReferenceHint}
      path={path}
      instillFormat={instillFormat}
    >
      {normalizedText && !hideField ? (
        <MDTextViewer text={normalizedText} />
      ) : null}
    </FieldRoot>
  );
};
