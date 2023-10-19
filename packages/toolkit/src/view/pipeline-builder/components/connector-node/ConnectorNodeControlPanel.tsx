import { Button, Icons } from "@instill-ai/design-system";
import { Nullable } from "../../../../lib";

export const ConnectorNodeControlPanel = ({
  resourceName,
  handleDeleteNode,
  handleCopyNode,
  handleEditNode,
  testModeEnabled,
}: {
  resourceName: Nullable<string>;
  handleDeleteNode: () => void;
  handleCopyNode: () => void;
  handleEditNode: () => void;
  testModeEnabled: boolean;
}) => {
  return (
    <div className="flex flex-row gap-x-3">
      <Button
        className="!px-1 !py-1 !my-auto hover:!bg-semantic-bg-secondary"
        variant="tertiaryGrey"
        size="sm"
        disabled={testModeEnabled}
        onClick={(e) => {
          e.stopPropagation();
          handleEditNode();
        }}
      >
        <Icons.Gear01 className="w-4 h-4 stroke-semantic-fg-secondary" />
      </Button>
      {resourceName ? (
        <Button
          className="!px-1 !py-1 !my-auto hover:!bg-semantic-bg-secondary"
          variant="tertiaryGrey"
          size="sm"
          disabled={testModeEnabled}
          onClick={(e) => {
            e.stopPropagation();
            handleCopyNode();
          }}
        >
          <Icons.Copy07 className="w-4 h-4 stroke-semantic-fg-secondary" />
        </Button>
      ) : null}
      <Button
        className="!px-1 !py-1 !my-auto hover:!bg-semantic-bg-secondary"
        variant="tertiaryGrey"
        size="sm"
        disabled={testModeEnabled}
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteNode();
        }}
      >
        <Icons.X className="w-4 h-4 stroke-semantic-fg-secondary" />
      </Button>
    </div>
  );
};
