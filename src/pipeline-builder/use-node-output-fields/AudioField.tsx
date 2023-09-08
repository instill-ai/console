import { Nullable } from "@instill-ai/toolkit";
import { ConnectorNodeFieldRoot, EndNodeFieldRoot } from "./FieldRoot";
import { getAudioTypeFromBase64 } from "pipeline-builder/lib";

export type AudioFieldProps = {
  nodeType: "end" | "connector";
  title: Nullable<string>;
  audio: Nullable<string>;
};

export const AudioField = (props: AudioFieldProps) => {
  const { nodeType, title, audio } = props;

  const audioType = audio ? getAudioTypeFromBase64(audio) : null;

  if (nodeType === "connector") {
    return (
      <ConnectorNodeFieldRoot title={title} key={`${title}-field`}>
        {audio ? (
          <audio
            className="w-[232px]"
            controls={true}
            src={`data:audio/${audioType};base64,${audio}`}
          />
        ) : (
          <></>
        )}
      </ConnectorNodeFieldRoot>
    );
  }

  return (
    <EndNodeFieldRoot title={title} key={`${title}-field`}>
      {audio ? (
        <audio
          className="w-[232px]"
          controls={true}
          src={`data:audio/${audioType};base64,${audio}`}
        />
      ) : (
        <></>
      )}
    </EndNodeFieldRoot>
  );
};
