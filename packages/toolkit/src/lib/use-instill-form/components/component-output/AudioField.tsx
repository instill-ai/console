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

  if (nodeType === "connector") {
    return (
      <ConnectorNodeFieldRoot title={title} fieldKey={`${title}-field`}>
        {audio && !hideField ? (
          <div className="flex w-full">
            <audio className="w-full" controls={true} src={audio} />
          </div>
        ) : null}
      </ConnectorNodeFieldRoot>
    );
  }

  return (
    <EndNodeFieldRoot title={title} key={`${title}-field`}>
      {audio && !hideField ? (
        <div className="flex w-full">
          <audio className="w-full" controls={true} src={audio} />
        </div>
      ) : null}
    </EndNodeFieldRoot>
  );
};
