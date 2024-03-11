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
  return <div className={cn("flex flex-col", className)}>{children}</div>;
};

export const ReferenceHintInstillFormat = ({
  instillFormat,
  className,
  isArray,
}: {
  instillFormat: string;
  className?: string;
  isArray?: boolean;
}) => {
  return (
    <div className="flex">
      {isArray ? (
        <div
          className={cn(
            "flex flex-row items-center gap-x-[3.62px] rounded-t bg-semantic-bg-secondary px-[7.25px] py-px",
            className
          )}
        >
          <p className="text-semantic-fg-secondary product-label-label-2">
            ARRAY
          </p>
          <p className="rounded-[3.62px] border border-semantic-bg-line bg-semantic-bg-base-bg px-[7.25px] py-px font-sans text-[9px] font-medium uppercase leading-[9px] text-semantic-fg-primary first-letter:rounded-[3.62px]">
            {instillFormat}
          </p>
        </div>
      ) : (
        <div
          className={cn(
            "rounded-t border border-semantic-bg-line bg-semantic-bg-base-bg px-[7.25px] py-px font-sans text-[9px] font-medium uppercase leading-[9px] text-semantic-fg-primary",
            className
          )}
        >
          {instillFormat}
        </div>
      )}
    </div>
  );
};

export const ReferenceHintPath = ({
  path,
  icon,
  className,
  description,
  disabledTooltip,
  disabledCopy,
}: {
  path: string;
  icon?: React.ReactElement;
  className?: string;
  description?: string;
  disabledTooltip?: boolean;
  disabledCopy?: boolean;
}) => {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  return (
    <div className="flex flex-row gap-x-1">
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
                await navigator.clipboard.writeText("${" + path + "}");
                setCopied(true);
                setOpen(true);
                setTimeout(() => {
                  setCopied(false);
                  setOpen(false);
                }, 1500);
              }}
              className={cn(
                "max-w-[240px] truncate px-[7.25px] py-px",
                "flex flex-row items-center gap-x-1 bg-semantic-accent-bg",
                "rounded-r rounded-bl",
                className
              )}
            >
              {icon}
              <p className="font-sans text-[11px] font-medium leading-[14.5px] text-semantic-accent-default">
                {path}
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
                  {copied ? "Copied to clipboard" : path}
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
      {description ? (
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Icons.InfoSquare className="h-[14px] w-[14px] stroke-semantic-fg-disabled" />
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                sideOffset={5}
                side="top"
                className="max-w-[300px] rounded-sm bg-semantic-bg-primary !px-3 !py-2"
              >
                <div className="flex flex-col text-left">
                  <p className="break-all bg-semantic-bg-primary product-body-text-4-semibold">
                    {description}
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
      ) : null}
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

export const ReferenceHintTag = {
  Root: ReferenceHintTagRoot,
  Icon: ReferenceHintTagIcon,
  Path: ReferenceHintPath,
  InstillFormat: ReferenceHintInstillFormat,
};
