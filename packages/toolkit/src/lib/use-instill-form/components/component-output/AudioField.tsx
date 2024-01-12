import { Nullable } from "../../../type";
import { ComponentOutputFieldBaseProps } from "../../type";
import { FieldRoot } from "./FieldRoot";

export type AudioFieldProps = {
  audio: Nullable<string>;
} & ComponentOutputFieldBaseProps;

export const AudioField = ({
  title,
  audio,
  hideField,
  componentID,
  enabledReferenceHint,
  path,
  instillFormat,
}: AudioFieldProps) => {
  return (
    <FieldRoot
      title={title}
      fieldKey={`${title}-field`}
      componentID={componentID}
      enabledReferenceHint={enabledReferenceHint}
      path={path}
      instillFormat={instillFormat}
    >
      {audio && !hideField ? (
        <div className="flex w-full">
          <audio className="w-full" controls={true} src={audio} />
        </div>
      ) : null}
    </FieldRoot>
  );
};
