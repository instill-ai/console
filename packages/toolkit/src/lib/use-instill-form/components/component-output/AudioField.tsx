import { Nullable } from "../../../type";
import { FieldRoot } from "./FieldRoot";

export type AudioFieldProps = {
  title: Nullable<string>;
  audio: Nullable<string>;
  hideField?: boolean;
};

export const AudioField = (props: AudioFieldProps) => {
  const { title, audio, hideField } = props;

  return (
    <FieldRoot title={title} fieldKey={`${title}-field`}>
      {audio && !hideField ? (
        <div className="flex w-full">
          <audio className="w-full" controls={true} src={audio} />
        </div>
      ) : null}
    </FieldRoot>
  );
};
