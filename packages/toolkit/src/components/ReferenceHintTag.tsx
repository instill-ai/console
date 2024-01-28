import cn from "clsx";
import * as React from "react";
import { Icons, Tooltip } from "@instill-ai/design-system";

export const ReferenceHintTagRoot = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex h-5 flex-row items-center gap-x-1 rounded-full bg-semantic-accent-bg px-2 py-1",
        className
      )}
    >
      {children}
    </div>
  );
};

export const ReferenceHintTagIcon = ({
  type,
  className,
}: {
  type: "x" | "check";
  className?: string;
}) => {
  return type === "x" ? (
    <Icons.ReferenceIconX
      className={cn("h-[9px] w-[18px] stroke-semantic-fg-secondary", className)}
    />
  ) : (
    <Icons.ReferenceIconCheck
      className={cn(
        "h-[9px] w-[18px] stroke-semantic-accent-default",
        className
      )}
    />
  );
};
export const ReferenceHintTagLabel = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <p
            className={cn(
              "max-w-[240px] truncate font-sans text-[11px] font-medium",
              className
            )}
          >
            {children}
          </p>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={5}
            side="top"
            className="max-w-[300px] rounded-sm bg-semantic-bg-primary !px-3 !py-2"
          >
            <div className="flex flex-col text-left">
              <p className="bg-semantic-bg-primary product-body-text-4-semibold">
                {children}
              </p>
            </div>
            <Tooltip.Arrow
              className="fill-semantic-bg-primary"
              offset={10}
              width={9}
              height={6}
            />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export const ReferenceHintTag = {
  Root: ReferenceHintTagRoot,
  Icon: ReferenceHintTagIcon,
  Label: ReferenceHintTagLabel,
};
