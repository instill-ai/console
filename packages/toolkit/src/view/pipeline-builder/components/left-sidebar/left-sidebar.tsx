import { Button, Icons } from "@instill-ai/design-system";
import { ComponentSection } from "./component-section";
import { InstillStore, useInstillStore, useShallow } from "../../../../lib";
import { FitView } from "reactflow";
import { VariableSection } from "./variable-section";
import { OutputSection } from "./output-section";
import { ConnectionSection } from "./connection-section";

const selector = (store: InstillStore) => ({
  updateLeftSidebarIsOpen: store.updateLeftSidebarIsOpen,
});

export const LeftSideBar = ({ fitView }: { fitView?: FitView }) => {
  const { updateLeftSidebarIsOpen } = useInstillStore(useShallow(selector));

  return (
    <div className="flex h-full w-full flex-col gap-y-4 bg-semantic-bg-primary">
      <Button
        onClick={() => {
          updateLeftSidebarIsOpen(() => false);
        }}
        variant="tertiaryGrey"
        className="ml-auto mr-2 !p-2"
      >
        <Icons.X className="h-4 w-4 stroke-semantic-fg-primary" />
      </Button>
      <ComponentSection fitView={fitView} />
      <ConnectionSection fitView={fitView} />
      <VariableSection />
      <OutputSection />
    </div>
  );
};
