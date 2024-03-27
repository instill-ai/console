"use client";

import cn from "clsx";
import * as React from "react";

export const VideoPreview = ({
  src,
  className,
}: {
  src: string;
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
          <CustomizePauseIcon className="h-1/3 w-1/3 stroke-white stroke-1" />
        </div>
      ) : (
        <div className="absolute bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center">
          <CustomizePlayIcon className="h-1/3 w-1/3 stroke-white" />
        </div>
      )}
    </div>
  );
};

const CustomizePlayIcon = ({ className }: { className?: string }) => {
  return (
    <svg
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

const CustomizePauseIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g filter="url(#filter0_b_857_30751)">
        <path
          d="M31.4998 28H28.4998V52H31.4998V28ZM51.4998 28H48.4998V52H51.4998V28ZM78.4998 40C78.4998 61.2629 61.2628 78.5 39.9998 78.5C18.7369 78.5 1.49985 61.2629 1.49985 40C1.49985 18.737 18.7369 1.49996 39.9998 1.49996C61.2628 1.49996 78.4998 18.737 78.4998 40Z"
          stroke="white"
          stroke-width="3"
        />
      </g>
      <defs>
        <filter
          id="filter0_b_857_30751"
          x="-19.2002"
          y="-19.2"
          width="118.4"
          height="118.4"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="9.6" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_857_30751"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_backgroundBlur_857_30751"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
