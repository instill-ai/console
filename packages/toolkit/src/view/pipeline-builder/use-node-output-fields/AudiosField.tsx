import { Nullable } from "../../../lib";
import { getAudioTypeFromBase64 } from "../lib";
import { ConnectorNodeFieldRoot, EndNodeFieldRoot } from "./FieldRoot";

export type AudiosFieldProps = {
  nodeType: "end" | "connector";
  title: Nullable<string>;
  audios: Nullable<string[]>;
};

export const AudiosField = (props: AudiosFieldProps) => {
  const { nodeType, title, audios } = props;

  if (nodeType === "connector") {
    return (
      <ConnectorNodeFieldRoot title={title} key={`${title}-field`}>
        {audios ? (
          audios.map((audio) => {
            const audioType = audio ? getAudioTypeFromBase64(audio) : null;
            return (
              <audio
                key={`${title}-${audio}-field`}
                className="w-[232px]"
                controls={true}
                src={`data:audio/${audioType};base64,${audio}`}
              />
            );
          })
        ) : (
          <></>
        )}
      </ConnectorNodeFieldRoot>
    );
  }

  return (
    <EndNodeFieldRoot title={title} key={`${title}-field`}>
      {audios ? (
        audios.map((audio) => {
          const audioType = audio ? getAudioTypeFromBase64(audio) : null;
          return (
            <audio
              key={`${title}-${audio}-field`}
              className="w-[232px]"
              controls={true}
              src={`data:audio/${audioType};base64,${audio}`}
            />
          );
        })
      ) : (
        <></>
      )}
    </EndNodeFieldRoot>
  );
};
