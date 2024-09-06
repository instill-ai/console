import * as React from "react";

import {
  Button,
  cn,
  Icons,
  Nullable,
  Popover,
  ScrollArea,
  Tag,
} from "@instill-ai/design-system";

const truncateStringMiddle = (string: string, maxLength: number) => {
  if (string.length > maxLength) {
    const length = Math.floor(maxLength / 2) - 4;

    return `${string.substring(0, length)}...${string.substring(string.length - length)}`;
  }

  return string;
};

const VersionButton = ({
  id,
  currentVersion,
  onClick,
}: {
  id: string;
  currentVersion: Nullable<string>;
  onClick: () => void;
}) => {
  return (
    <Button
      key={id}
      className={cn(
        "w-full !px-2 !py-1.5",
        currentVersion === id ? "!bg-semantic-bg-secondary" : "",
      )}
      variant={"tertiaryColour"}
      onClick={onClick}
    >
      <div className="flex w-full flex-row gap-x-2">
        <div className="my-auto h-2 w-[9px] rounded-full bg-semantic-secondary-default"></div>
        <p
          className={cn(
            "w-full text-left text-semantic-fg-secondary product-body-text-3-medium text-ellipsis overflow-hidden",
          )}
        >
          {truncateStringMiddle(id, 22)}
        </p>
      </div>
    </Button>
  );
};

export type VersionDropdownSelectorProps = {
  activeVersion: Nullable<string>;
  versions: string[];
  onVersionUpdate: (value: string) => void;
};

export const VersionDropdownSelector = ({
  activeVersion,
  versions,
  onVersionUpdate,
}: VersionDropdownSelectorProps) => {
  const [isVersionSelectorOpen, setIsVersionSelectorOpen] =
    React.useState<boolean>(false);

  return (
    <div className="relative ml-auto">
      <div className="absolute bottom-full left-0 ml-4 font-semibold text-sm text-semantic-fg-secondary">
        Version
      </div>
      <Popover.Root
        onOpenChange={(open) => {
          if (!open) {
            setIsVersionSelectorOpen(open);
          }
        }}
        open={isVersionSelectorOpen}
      >
        <Popover.Trigger asChild={true} className="my-auto">
          <Button
            className={cn(
              "!h-8 !w-[145px] gap-x-1 !rounded-sm !border border-[#E1E6EF] !py-1 px-3 !transition-opacity !duration-300 !ease-in-out",
              isVersionSelectorOpen
                ? "border-opacity-100 !bg-semantic-accent-bg "
                : "border-opacity-0",
            )}
            size="sm"
            variant="tertiaryColour"
            type="button"
            onClick={() => setIsVersionSelectorOpen(true)}
          >
            <Tag
              size="sm"
              variant="darkPurple"
              className="h-6 gap-x-2 min-w-0 flex-1"
            >
              <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                {truncateStringMiddle(activeVersion || "", 18)}
              </span>
            </Tag>
            <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-primary shrink-0" />
          </Button>
        </Popover.Trigger>
        <Popover.Content
          side="bottom"
          sideOffset={4}
          align="end"
          className="flex flex-col !rounded-sm !p-0"
          style={{
            width: "145px",
            height: "260px",
          }}
        >
          <ScrollArea.Root className="[&>div>div]:!block !h-[260px]">
            <div className="flex flex-col gap-y-1 px-1.5 py-1">
              {versions.length > 0 ? (
                <React.Fragment>
                  {versions.map((version) => (
                    <VersionButton
                      key={version}
                      id={version}
                      currentVersion={activeVersion}
                      onClick={() => {
                        onVersionUpdate(version);
                        setIsVersionSelectorOpen(false);
                      }}
                    />
                  ))}
                </React.Fragment>
              ) : (
                <div className="p-2 text-semantic-fg-disabled product-body-text-4-medium">
                  No versions
                </div>
              )}
            </div>
          </ScrollArea.Root>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
};
