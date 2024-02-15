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
        "flex h-5 flex-row items-center gap-x-1 rounded bg-semantic-accent-bg px-2 py-1",
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
  label,
  className,
  disabledTooltip,
  disabledCopy,
}: {
  label: string;
  className?: string;
  disabledTooltip?: boolean;
  disabledCopy?: boolean;
}) => {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  return (
    <Tooltip.Provider>
      <Tooltip.Root
        open={open}
        onOpenChange={(open) => {
          if (disabledTooltip) {
            setOpen(false);
            return;
          }

          if (copied) {
            return;
          }
          setOpen(open);
        }}
      >
        <Tooltip.Trigger asChild>
          <button
            onClick={async (e) => {
              if (disabledCopy) {
                return;
              }

              e.stopPropagation();
              e.preventDefault();
              await navigator.clipboard.writeText("${" + label + "}");
              setCopied(true);
              setOpen(true);
              setTimeout(() => {
                setCopied(false);
              }, 1500);
            }}
          >
            <p
              className={cn(
                "max-w-[240px] truncate font-sans text-[11px] font-medium",
                className
              )}
            >
              {label}
            </p>
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={5}
            side="top"
            className="max-w-[300px] rounded-sm bg-semantic-bg-primary !px-3 !py-2"
          >
            <div className="flex flex-col text-left">
              <p className="break-all bg-semantic-bg-primary product-body-text-4-semibold">
                {copied ? "Copied to clipboard" : label}
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
