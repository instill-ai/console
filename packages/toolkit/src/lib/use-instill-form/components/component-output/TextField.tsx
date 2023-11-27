import { Nullable } from "../../../type";
import { FieldRoot } from "./FieldRoot";
import { MDTextViewer } from "./MDTextViewer";

export type TextFieldProps = {
  title: Nullable<string>;
  text: Nullable<string>;
  hideField?: boolean;
};

export const TextField = (props: TextFieldProps) => {
  const { title, text, hideField } = props;

  const normalizedText = text ? String(text) : null;

  return (
    <FieldRoot title={title} key={`${title}-field`}>
      {normalizedText && !hideField ? (
        <MDTextViewer text={normalizedText} />
      ) : null}
    </FieldRoot>
  );
};
