import { Nullable } from "../../../type";
import { ComponentOutputFieldBaseProps } from "../../type";
import { FieldRoot } from "./FieldRoot";

export type AudiosFieldProps = {
  audios: Nullable<string[]>;
} & ComponentOutputFieldBaseProps;

export const AudiosField = ({
  title,
  audios,
  hideField,
  componentID,
  enabledReferenceHint,
  path,
  instillFormat,
}: AudiosFieldProps) => {
  return (
    <FieldRoot
      title={title}
      fieldKey={`${title}-field`}
      componentID={componentID}
      enabledReferenceHint={enabledReferenceHint}
      path={path}
      instillFormat={instillFormat}
    >
      {audios && !hideField ? (
        <div className="flex w-full flex-col">
          {audios.map((audio) => {
            return (
              <audio
                key={`${title}-${audio}-field`}
                className="w-full"
                controls={true}
                src={audio}
              />
            );
          })}
        </div>
      ) : null}
    </FieldRoot>
  );
};
