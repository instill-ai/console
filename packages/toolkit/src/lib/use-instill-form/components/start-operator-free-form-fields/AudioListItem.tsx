import * as React from "react";
import * as Progress from "@radix-ui/react-progress";
import { Icons } from "@instill-ai/design-system";
import { Nullable } from "../../../type";

export const AudioListItem = ({
  name,
  src,
  onDelete,
}: {
  name: string;
  src: string;
  onDelete: () => void;
}) => {
  const timer = React.useRef<Nullable<number>>(null);
  const ref = React.useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = React.useState<number>(0);
  const [isPlaying, setIsPlaying] = React.useState(false);

  return (
    <div className="relative flex w-full flex-col">
      <audio
        ref={ref}
        className="w-full"
        src={src}
        onTimeUpdate={(e) => {
          if (!e.currentTarget.currentTime) {
            return;
          }
          if (timer.current) {
            cancelAnimationFrame(timer.current);
          }
          const progress =
            (e.currentTarget.currentTime / e.currentTarget.duration) * 100;
          timer.current = requestAnimationFrame(() => {
            setProgress(progress);
          });
        }}
      />
      <Progress.Root
        className="relative h-8 w-full overflow-hidden rounded"
        value={progress}
      >
        <Progress.Indicator
          className="h-full w-full flex-1 bg-semantic-bg-line transition-all"
          style={{ transform: `translateX(-${100 - progress}%)` }}
        />
      </Progress.Root>
      <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-row px-2">
        <Icons.Recording03 className="my-auto mr-2 h-5 w-5 stroke-semantic-fg-secondary" />
        <p className="my-auto w-[180px] truncate text-semantic-fg-primary product-body-text-3-regular">
          {name}
        </p>
        <div className="my-auto ml-auto flex flex-row gap-x-2">
          <button
            onClick={() => {
              if (ref.current) {
                if (ref.current.paused) {
                  ref.current.play();
                  setIsPlaying(true);
                } else {
                  ref.current.pause();
                  setIsPlaying(false);
                }
              }
            }}
            className="rounded p-1 hover:bg-semantic-bg-secondary"
            type="button"
          >
            {isPlaying ? (
              <Icons.PauseCircle className="h-4 w-4 stroke-semantic-fg-secondary" />
            ) : (
              <Icons.PlayCircle className="h-4 w-4 stroke-semantic-fg-secondary" />
            )}
          </button>
          <button
            onClick={() => onDelete()}
            className="rounded p-1 hover:bg-semantic-bg-secondary"
            type="button"
          >
            <Icons.X className="h-4 w-4 stroke-semantic-fg-secondary" />
          </button>
        </div>
      </div>
    </div>
  );
};
