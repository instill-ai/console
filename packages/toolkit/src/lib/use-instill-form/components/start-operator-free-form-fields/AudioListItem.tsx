import * as React from "react";
import * as Progress from "@radix-ui/react-progress";
import { Nullable } from "../../../type";
import { Icons } from "@instill-ai/design-system";

export const AudioListItem = ({
  file,
  onDelete,
}: {
  file: Nullable<File>;
  onDelete: () => void;
}) => {
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
      <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-row">
        <Icons.Recording03 className="mr-2 h-5 w-5 stroke-semantic-fg-secondary" />
        <p className="w-[180px] truncate text-semantic-fg-primary product-body-text-3-regular">
          {file.name}
        </p>
        <div className="ml-auto flex flex-row">
          <button
            onClick={() => onDelete()}
            className="hover:bg-semantic-bg-secondary"
            type="button"
          >
            <Icons.X className="h-4 w-4 stroke-semantic-fg-secondary" />
          </button>
          <button
            onClick={() => onDelete()}
            className="hover:bg-semantic-bg-secondary"
            type="button"
          >
            <Icons.X className="h-4 w-4 stroke-semantic-fg-secondary" />
          </button>
        </div>
      </div>
    </div>
  );
};
