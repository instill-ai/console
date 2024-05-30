import * as React from "react";
import { Icons } from "@instill-ai/design-system";

interface ProgressCSSProps extends React.CSSProperties {
  "--progress-width": number;
  "--buffered-width": number;
}

interface AudioProgressBarProps
  extends React.ComponentPropsWithoutRef<"input"> {
  duration: number;
  currentProgress: number;
  buffered: number;
}

function AudioProgressBar(props: AudioProgressBarProps) {
  const { duration, currentProgress, buffered, ...rest } = props;

  const progressBarWidth = isNaN(currentProgress / duration)
    ? 0
    : currentProgress / duration;
  const bufferedWidth = isNaN(buffered / duration) ? 0 : buffered / duration;

  const progressStyles: ProgressCSSProps = {
    "--progress-width": progressBarWidth,
    "--buffered-width": bufferedWidth,
  };

  return (
    <div className="group absolute -top-[4px] left-3 right-3 h-1 w-[96%]">
      <input
        type="range"
        name="progress"
        className={`progress-bar after:bg-semantic-fg-secondary/50 absolute inset-0 m-0 h-full w-full cursor-pointer appearance-none bg-transparent accent-semantic-fg-secondary transition-all before:absolute before:inset-0 before:h-full before:w-full before:origin-left before:bg-semantic-fg-secondary after:absolute after:h-full after:w-full hover:accent-semantic-fg-secondary group-hover:h-2 dark:bg-gray-700`}
        style={progressStyles}
        min={0}
        max={duration}
        value={currentProgress}
        {...rest}
      />
    </div>
  );
}

export function IconButton({ ...props }) {
  return (
    <button className="rounded p-1 hover:bg-semantic-bg-secondary" {...props} />
  );
}

function formatDurationDisplay(duration: number) {
  const min = Math.floor(duration / 60);
  const sec = Math.floor(duration - min * 60);

  const formatted = [min, sec].map((n) => (n < 10 ? "0" + n : n)).join(":");

  return formatted;
}

interface AudioPlayerProps {
  currentSong?: string;
}

export default function AudioPlayer({ currentSong }: AudioPlayerProps) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const [isReady, setIsReady] = React.useState(false);
  const [duration, setDuration] = React.useState(0);
  const [currrentProgress, setCurrrentProgress] = React.useState(0);
  const [buffered, setBuffered] = React.useState(0);
  const [volume, setVolume] = React.useState(0.2);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const durationDisplay = formatDurationDisplay(duration);
  const elapsedDisplay = formatDurationDisplay(currrentProgress);

  React.useEffect(() => {
    audioRef.current?.pause();

    const timeout = setTimeout(() => {
      audioRef.current?.play();
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handleBufferProgress: React.ReactEventHandler<HTMLAudioElement> = (
    e
  ) => {
    const audio = e.currentTarget;
    const dur = audio.duration;
    if (dur > 0) {
      for (let i = 0; i < audio.buffered.length; i++) {
        if (
          audio.buffered.start(audio.buffered.length - 1 - i) <
          audio.currentTime
        ) {
          const bufferedLength = audio.buffered.end(
            audio.buffered.length - 1 - i
          );
          setBuffered(bufferedLength);
          break;
        }
      }
    }
  };

  const handleMuteUnmute = () => {
    if (!audioRef.current) return;

    if (audioRef.current.volume !== 0) {
      audioRef.current.volume = 0;
    } else {
      audioRef.current.volume = 1;
    }
  };

  return (
    <div className="relative p-3 text-slate-400">
      {currentSong && (
        <audio
          ref={audioRef}
          preload="metadata"
          onDurationChange={(e) => setDuration(e.currentTarget.duration)}
          onPlaying={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onCanPlay={(e) => {
            e.currentTarget.volume = volume;
            setIsReady(true);
          }}
          onTimeUpdate={(e) => {
            setCurrrentProgress(e.currentTarget.currentTime);
            handleBufferProgress(e);
          }}
          onProgress={handleBufferProgress}
          onVolumeChange={(e) => setVolume(e.currentTarget.volume)}
        >
          <source type="audio/mpeg" src={currentSong} />
        </audio>
      )}
      <AudioProgressBar
        duration={duration}
        currentProgress={currrentProgress}
        buffered={buffered}
        onChange={(e) => {
          if (!audioRef.current) return;

          audioRef.current.currentTime = e.currentTarget.valueAsNumber;

          setCurrrentProgress(e.currentTarget.valueAsNumber);
        }}
      />
      <div className="flex flex-row">
        <div className="flex w-1/2 justify-start">
          <span className="text-xs">{elapsedDisplay}</span>
        </div>
        <div className="flex w-1/2 justify-end">
          <span className="text-xs">{durationDisplay}</span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 items-center">
        <div className="flex items-center gap-3 justify-self-start">
          <IconButton
            intent="secondary"
            size="sm"
            onClick={handleMuteUnmute}
            aria-label={volume === 0 ? "unmute" : "mute"}
          >
            {volume === 0 ? (
              <Icons.VolumeX className="h-6 w-6 stroke-semantic-fg-secondary" />
            ) : (
              <Icons.VolumeMax className="h-6 w-6 stroke-semantic-fg-secondary" />
            )}
          </IconButton>
        </div>
        <div className="flex items-center gap-4 justify-self-center">
          <IconButton aria-label="go to previous" intent="secondary">
            <Icons.FastBackward className="h-8 w-8 stroke-semantic-fg-secondary" />
          </IconButton>
          <IconButton
            disabled={!isReady}
            onClick={togglePlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
            size="lg"
          >
            {isPlaying ? (
              <Icons.PauseCircle className="h-8 w-8 stroke-semantic-fg-secondary" />
            ) : (
              <Icons.PlayCircle className="h-8 w-8 stroke-semantic-fg-secondary" />
            )}
          </IconButton>
          <IconButton aria-label="go to next" intent="secondary">
            <Icons.FastForward className="h-8 w-8 stroke-semantic-fg-secondary" />
          </IconButton>
        </div>
        <div></div>
      </div>
    </div>
  );
}
