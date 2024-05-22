import { Button, Icons } from "@instill-ai/design-system";
import { InstillStore, useInstillStore, useShallow } from "../../../../lib";

const selector = (store: InstillStore) => ({
  updateBottomDrawerIsOpen: store.updateBottomDrawerIsOpen,
});

export const BottomDrawer = () => {
  const { updateBottomDrawerIsOpen } = useInstillStore(useShallow(selector));

  return (
    <div className="flex h-full w-full flex-col bg-semantic-bg-primary">
      <div className="flex flex-row justify-end">
        <Button
          variant="tertiaryGrey"
          onClick={() => {
            updateBottomDrawerIsOpen(() => false);
          }}
        >
          <Icons.X className="h-4 w-4 stroke-semantic-fg-primary" />
        </Button>
      </div>
    </div>
  );
};
