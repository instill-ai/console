import cn from "clsx";
import * as React from "react";
import { FieldMode } from "../../type";

export const VideoPreview = ({
  src,
  mode,
  className,
}: {
  src: string;
  mode: FieldMode;
  className?: string;
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  return (
    <div
      onClick={() => {
        if (videoRef.current?.paused) {
          videoRef.current?.play();
          setIsPlaying(true);
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      }}
      className="relative"
    >
      <video
        ref={videoRef}
        src={src}
        className={cn("w-full object-contain", className)}
      />
      {isPlaying ? (
        <div className="absolute bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center">
          <PauseIcon className="h-1/3 w-1/3 stroke-white" />
        </div>
      ) : (
        <div className="absolute bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center">
          <PlayIcon className="h-1/3 w-1/3 stroke-white" />
        </div>
      )}
    </div>
  );
};

const PauseIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M78.1998 40C78.1998 61.0972 61.0971 78.2 39.9998 78.2C18.9026 78.2 1.79985 61.0972 1.79985 40C1.79985 18.9027 18.9026 1.79996 39.9998 1.79996C61.0971 1.79996 78.1998 18.9027 78.1998 40Z"
        strokeWidth="3.6"
      />
    </svg>
  );
};

const PlayIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="1.5"
        y="1.5"
        width="77"
        height="77"
        rx="38.5"
        stroke="white"
        strokeWidth="3"
      />
      <path
        d="M56.25 37.904C57.9167 38.8355 57.9167 41.1645 56.25 42.096L33.75 54.6721C32.0833 55.6037 30 54.4392 30 52.5761L30 27.4239C30 25.5608 32.0833 24.3963 33.75 25.3279L56.25 37.904Z"
        fill="white"
      />
    </svg>
  );
};
