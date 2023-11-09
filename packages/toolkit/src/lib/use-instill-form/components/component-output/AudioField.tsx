import { getAudioTypeFromBase64 } from "../../../../view";
import { Nullable } from "../../../type";
import { ConnectorNodeFieldRoot, EndNodeFieldRoot } from "./FieldRoot";

export type AudioFieldProps = {
  nodeType: "end" | "connector";
  title: Nullable<string>;
  audio: Nullable<string>;
  hideField?: boolean;
};

export const AudioField = (props: AudioFieldProps) => {
  const { nodeType, title, audio, hideField } = props;

  const audioType = audio ? getAudioTypeFromBase64(audio) : null;

  if (nodeType === "connector") {
    return (
      <ConnectorNodeFieldRoot title={title} key={`${title}-field`}>
        {audio && !hideField ? (
          <div className="flex w-full">
            <audio
              className="w-full"
              controls={true}
              src={`data:audio/${audioType};base64,${audio}`}
            />
          </div>
        ) : null}
      </ConnectorNodeFieldRoot>
    );
  }

  return (
    <EndNodeFieldRoot title={title} key={`${title}-field`}>
      {audio && !hideField ? (
        <div className="flex w-full">
          <audio
            className="w-full"
            controls={true}
            src={`data:audio/${audioType};base64,${audio}`}
          />
        </div>
      ) : null}
    </EndNodeFieldRoot>
  );
};
