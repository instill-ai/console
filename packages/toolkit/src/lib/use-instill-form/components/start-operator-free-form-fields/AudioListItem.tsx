import * as React from "react";
import * as Progress from "@radix-ui/react-progress";
import { Nullable } from "../../../type";

export const AudioListItem = ({ file }: { file: Nullable<File> }) => {
  const [progress, setProgress] = React.useState(0);

  if (!file) {
    return null;
  }

  return (
    <div className="relative flex w-full">
      <audio
        id={file.name}
        className="hidden w-full"
        controls={true}
        src={URL.createObjectURL(file)}
        onTimeUpdate={(e) => {
          setProgress(
            (e.currentTarget.currentTime / e.currentTarget.duration) * 100
          );
        }}
      />
      <Progress.Root
        className="relative h-8 w-full overflow-hidden"
        value={progress}
      >
        <Progress.Indicator
          className="h-full w-full flex-1 bg-semantic-bg-secondary transition-all"
          style={{ transform: `translateX(-${100 - progress}%)` }}
        />
      </Progress.Root>
      <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-row"></div>
    </div>
  );
};
