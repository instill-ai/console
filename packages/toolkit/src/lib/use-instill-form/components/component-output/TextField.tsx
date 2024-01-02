import { Nullable } from "../../../type";
import { ComponentOutputFieldBaseProps } from "../../type";
import { FieldRoot } from "./FieldRoot";
import { MDTextViewer } from "./MDTextViewer";

export type TextFieldProps = {
  text: Nullable<string>;
} & ComponentOutputFieldBaseProps;

export const TextField = (props: TextFieldProps) => {
  const { title, text, hideField } = props;

  const normalizedText = text ? String(text) : null;

  return (
    <FieldRoot title={title} fieldKey={`${title}-field`}>
      {normalizedText && !hideField ? (
        <MDTextViewer text={normalizedText} />
      ) : null}
    </FieldRoot>
  );
};
