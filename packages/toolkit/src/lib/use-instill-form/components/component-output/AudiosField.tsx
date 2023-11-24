import { getAudioTypeFromBase64 } from "../../../../view";
import { Nullable } from "../../../type";
import { ConnectorNodeFieldRoot, EndNodeFieldRoot } from "./FieldRoot";

export type AudiosFieldProps = {
  nodeType: "end" | "connector";
  title: Nullable<string>;
  audios: Nullable<string[]>;
  hideField?: boolean;
};

export const AudiosField = (props: AudiosFieldProps) => {
  const { nodeType, title, audios, hideField } = props;

  if (nodeType === "connector") {
    return (
      <ConnectorNodeFieldRoot title={title} fieldKey={`${title}-field`}>
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
      </ConnectorNodeFieldRoot>
    );
  }

  return (
    <EndNodeFieldRoot title={title} key={`${title}-field`}>
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
    </EndNodeFieldRoot>
  );
};
