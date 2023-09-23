import { Logo } from "@instill-ai/design-system";
import Image from "next/image";

export const AuthPageBase = ({ children }: { children: React.ReactNode }) => {
  return <div className="min-w-screen min-h-screen">{children}</div>;
};

const Container = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex h-screen w-full flex-1">{children}</div>;
};

const Content = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid h-full w-full grid-flow-row grid-cols-2">
      <div className="flex h-full flex-col bg-[#F9FAFB]">
        <div className="ml-auto flex h-full w-full max-w-[720px] flex-col">
          <div className="mb-auto flex flex-col p-8">
            <Logo
              className="!mb-[100px] !mt-0"
              variant="ColourLogomarkBlackType"
              width={215}
            />
            <div className="mb-auto flex flex-col gap-y-[60px] px-8">
              <div className="flex flex-col gap-y-1">
                <p className="font-sans text-5xl font-bold leading-[60px]">
                  <span className="text-semantic-fg-primary">Meet</span>{" "}
                  <span className="text-semantic-accent-default">
                    Instill Core
                  </span>
                </p>
                <p className="font-sans text-xl font-bold leading-4 text-semantic-fg-primary">
                  The Backbone for All Your AI Needs
                </p>
              </div>
              <p className="font-sans text-[40px] font-semibold leading-[50px]">
                A no-code/low-code platform to build AI-first applications to
                process your text, image, video and audio in minutes
              </p>
            </div>
          </div>

          <div className="flex flex-row">
            <p className="mr-auto mt-auto p-8 font-sans text-semantic-fg-disabled product-body-text-3-regular">
              © Instill AI 2023
            </p>
            <Image
              src="/images/auth-page-bg-strip.svg"
              alt="auth-page-bg-strip"
              width={407}
              height={392}
            />
          </div>
        </div>
      </div>
      <div className="flex h-full bg-semantic-bg-primary">
        <div className="mr-auto flex h-full w-full max-w-[720px]">
          {children}
        </div>
      </div>
    </div>
  );
};

AuthPageBase.Container = Container;
AuthPageBase.Content = Content;
