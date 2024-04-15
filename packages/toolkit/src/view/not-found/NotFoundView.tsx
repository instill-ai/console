"use client";

import { Button, Icons } from "@instill-ai/design-system";
import { LinkBlock } from "./LinkBlock";
import { useRouter } from "next/navigation";

export const NotFoundView = () => {
  const router = useRouter();

  return (
    <div className="relative mx-auto flex w-[1440px] flex-col px-20 py-24">
      <BackgroundSVG className="absolute left-1/2 top-0 -translate-x-1/2" />
      <div className="mb-8 flex flex-col px-8 py-[88px]">
        <div className="relative mx-auto mb-12 flex w-[768px] flex-col gap-y-6">
          <div className="mx-auto flex h-14 w-14 border border-semantic-bg-line bg-semantic-bg-primary">
            <Icons.SearchLg className="m-auto h-7 w-7 shrink-0 grow-0 stroke-semantic-fg-primary" />
          </div>
          <h1 className="fond-sans text-center text-[60px] font-semibold leading-[72px]">
            Page not found
          </h1>
          <div className="flex flex-col text-center font-sans text-xl font-normal text-semantic-fg-disabled">
            <p>The page you are looking for doesn&apos;t exist.</p>
            <p>Here are some helpful links:</p>
          </div>
        </div>
        <div className="mx-auto flex flex-row gap-x-3">
          <Button
            onClick={() => {
              router.back();
            }}
            className="gap-x-2"
            variant="secondaryGrey"
            size="lg"
          >
            <Icons.ArrowLeft className="h-4 w-4 shrink-0 grow-0 stroke-semantic-fg-primary" />
            Go Back
          </Button>
          <Button
            onClick={() => {
              router.push("/");
            }}
            variant="primary"
            size="lg"
          >
            Home
          </Button>
        </div>
      </div>
      <div className="grid grid-flow-row grid-cols-3 gap-x-8 px-8">
        <LinkBlock
          headIcon={
            <Icons.CodeSquare02 className="h-[18px] w-[18px] stroke-semantic-accent-default" />
          }
          title="Documentation"
          description="Dive in to learn all about our product."
          cta={{
            link: "https://www.instill.tech/docs/welcome",
            text: "Start Learning",
          }}
        />
        <LinkBlock
          headIcon={
            <Icons.BookOpen02 className="h-[18px] w-[18px] stroke-semantic-accent-default" />
          }
          title="Our Blog"
          description="Read the latest posts on our blog."
          cta={{
            link: "https://www.instill.tech/blog",
            text: "Read Latest Posts",
          }}
        />
        <LinkBlock
          headIcon={
            <Icons.MessageChatSquare className="h-[18px] w-[18px] stroke-semantic-accent-default" />
          }
          title="Chat to us"
          description="Can't find what you're looking for?"
          cta={{
            link: "https://discord.com/invite/sevxWsqpGh",
            text: "Join the community",
          }}
        />
      </div>
    </div>
  );
};

export const BackgroundSVG = ({ className }: { className?: string }) => {
  return (
    <svg
      width="480"
      height="481"
      viewBox="0 0 480 481"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <mask
        id="mask0_636_10859"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="480"
        height="481"
      >
        <rect
          width="480"
          height="480"
          transform="translate(0 0.382812)"
          fill="url(#paint0_radial_636_10859)"
        />
      </mask>
      <g mask="url(#mask0_636_10859)">
        <g clipPath="url(#clip0_636_10859)">
          <g clipPath="url(#clip1_636_10859)">
            <line
              x1="0.5"
              y1="0.382812"
              x2="0.5"
              y2="480.383"
              stroke="#EAECF0"
            />
            <line
              x1="32.5"
              y1="0.382812"
              x2="32.5"
              y2="480.383"
              stroke="#EAECF0"
            />
            <line
              x1="64.5"
              y1="0.382812"
              x2="64.5"
              y2="480.383"
              stroke="#EAECF0"
            />
            <line
              x1="96.5"
              y1="0.382812"
              x2="96.5"
              y2="480.383"
              stroke="#EAECF0"
            />
            <line
              x1="128.5"
              y1="0.382812"
              x2="128.5"
              y2="480.383"
              stroke="#EAECF0"
            />
            <line
              x1="160.5"
              y1="0.382812"
              x2="160.5"
              y2="480.383"
              stroke="#EAECF0"
            />
            <line
              x1="192.5"
              y1="0.382812"
              x2="192.5"
              y2="480.383"
              stroke="#EAECF0"
            />
            <line
              x1="224.5"
              y1="0.382812"
              x2="224.5"
              y2="480.383"
              stroke="#EAECF0"
            />
            <line
              x1="256.5"
              y1="0.382812"
              x2="256.5"
              y2="480.383"
              stroke="#EAECF0"
            />
            <line
              x1="288.5"
              y1="0.382812"
              x2="288.5"
              y2="480.383"
              stroke="#EAECF0"
            />
            <line
              x1="320.5"
              y1="0.382812"
              x2="320.5"
              y2="480.383"
              stroke="#EAECF0"
            />
            <line
              x1="352.5"
              y1="0.382812"
              x2="352.5"
              y2="480.383"
              stroke="#EAECF0"
            />
            <line
              x1="384.5"
              y1="0.382812"
              x2="384.5"
              y2="480.383"
              stroke="#EAECF0"
            />
            <line
              x1="416.5"
              y1="0.382812"
              x2="416.5"
              y2="480.383"
              stroke="#EAECF0"
            />
            <line
              x1="448.5"
              y1="0.382812"
              x2="448.5"
              y2="480.383"
              stroke="#EAECF0"
            />
          </g>
          <rect
            x="0.5"
            y="0.882812"
            width="479"
            height="479"
            stroke="#EAECF0"
          />
          <g clipPath="url(#clip2_636_10859)">
            <line y1="31.8828" x2="480" y2="31.8828" stroke="#EAECF0" />
            <line y1="63.8828" x2="480" y2="63.8828" stroke="#EAECF0" />
            <line y1="95.8828" x2="480" y2="95.8828" stroke="#EAECF0" />
            <line y1="127.883" x2="480" y2="127.883" stroke="#EAECF0" />
            <line y1="159.883" x2="480" y2="159.883" stroke="#EAECF0" />
            <line y1="191.883" x2="480" y2="191.883" stroke="#EAECF0" />
            <line y1="223.883" x2="480" y2="223.883" stroke="#EAECF0" />
            <line y1="255.883" x2="480" y2="255.883" stroke="#EAECF0" />
            <line y1="287.883" x2="480" y2="287.883" stroke="#EAECF0" />
            <line y1="319.883" x2="480" y2="319.883" stroke="#EAECF0" />
            <line y1="351.883" x2="480" y2="351.883" stroke="#EAECF0" />
            <line y1="383.883" x2="480" y2="383.883" stroke="#EAECF0" />
            <line y1="415.883" x2="480" y2="415.883" stroke="#EAECF0" />
            <line y1="447.883" x2="480" y2="447.883" stroke="#EAECF0" />
            <line y1="479.883" x2="480" y2="479.883" stroke="#EAECF0" />
          </g>
          <rect
            x="0.5"
            y="0.882812"
            width="479"
            height="479"
            stroke="#EAECF0"
          />
        </g>
      </g>
      <defs>
        <radialGradient
          id="paint0_radial_636_10859"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(240 240) rotate(90) scale(240 240)"
        >
          <stop />
          <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <clipPath id="clip0_636_10859">
          <rect
            width="480"
            height="480"
            fill="white"
            transform="translate(0 0.382812)"
          />
        </clipPath>
        <clipPath id="clip1_636_10859">
          <rect y="0.382812" width="480" height="480" fill="white" />
        </clipPath>
        <clipPath id="clip2_636_10859">
          <rect y="0.382812" width="480" height="480" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
