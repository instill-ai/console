import { Nullable } from "../../../type";
import { FieldRoot } from "./FieldRoot";

export type AudiosFieldProps = {
  title: Nullable<string>;
  audios: Nullable<string[]>;
  hideField?: boolean;
};

export const AudiosField = (props: AudiosFieldProps) => {
  const { title, audios, hideField } = props;

  return (
    <FieldRoot title={title} fieldKey={`${title}-field`}>
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
