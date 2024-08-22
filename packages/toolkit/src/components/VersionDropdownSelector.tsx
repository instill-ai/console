import * as React from "react";
import { Button, cn, Icons, Nullable, Popover, ScrollArea, Tag } from "@instill-ai/design-system";

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
            "w-full text-left text-semantic-fg-secondary product-body-text-3-medium",
          )}
        >
          {id}
        </p>
      </div>
    </Button>
  );
};

export type VersionDropdownSelectorProps = {
  activeVersion: Nullable<string>;
  versions: string[];
  onVersionUpdate: (value: string) => void;
}

export const VersionDropdownSelector = ({ activeVersion, versions, onVersionUpdate }: VersionDropdownSelectorProps) => {
  const [isVersionSelectorOpen, setIsVersionSelectorOpen] = React.useState<boolean>(false);

  return (
    <Popover.Root
      onOpenChange={() =>
        setIsVersionSelectorOpen(!isVersionSelectorOpen)
      }
      open={isVersionSelectorOpen}
    >
      <Popover.Trigger asChild={true} className="my-auto">
        <Button
          className={cn(
            "!h-8 !w-[145px] gap-x-1 !rounded-sm !border border-[#E1E6EF] !py-1 px-3 !transition-opacity !duration-300 !ease-in-out ml-auto",
            isVersionSelectorOpen
              ? "border-opacity-100 !bg-semantic-accent-bg "
              : "border-opacity-0",
          )}
          size="sm"
          variant="tertiaryColour"
          type="button"
          onClick={() => setIsVersionSelectorOpen(true)}
        >
          <Tag size="sm" variant="darkPurple" className="h-6 gap-x-2">
            Version: {activeVersion}
          </Tag>
          <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-primary" />
        </Button>
      </Popover.Trigger>
      <Popover.Content
        side="bottom"
        sideOffset={4}
        align="start"
        className="flex flex-col !rounded-sm !p-0"
        style={{
          width: '145px',
          maxHeight: '180px',
        }}
      >
        <ScrollArea.Root>
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
                No released versions.
              </div>
            )}
          </div>
        </ScrollArea.Root>
      </Popover.Content>
    </Popover.Root>
  )
}