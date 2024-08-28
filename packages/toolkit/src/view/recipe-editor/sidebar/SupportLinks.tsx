import { Icons } from "@instill-ai/design-system";

import {
  DefaultEditorViewIDs,
  InstillStore,
  useInstillStore,
  useShallow,
} from "../../../lib";
import { getGettingStartedEditorView } from "../getting-started-view";

const selector = (store: InstillStore) => ({
  updateEditorMultiScreenModel: store.updateEditorMultiScreenModel,
});

export const SupportLinks = () => {
  const { updateEditorMultiScreenModel } = useInstillStore(
    useShallow(selector),
  );

  return (
    <div className="flex flex-col gap-y-2">
      <button
        onClick={() => {
          updateEditorMultiScreenModel((prev) => ({
            ...prev,
            topRight: {
              views: [
                ...prev.topRight.views.filter(
                  (view) => view.id !== DefaultEditorViewIDs.GETTING_STARTED,
                ),
                getGettingStartedEditorView(),
              ],
              currentViewId: DefaultEditorViewIDs.GETTING_STARTED,
            },
          }));
        }}
        className="flex gap-x-2 py-1.5 px-2 hover:bg-semantic-bg-alt-primary rounded"
      >
        <Icons.MagicWand01 className="h-3 w-3 stroke-semantic-fg-disabled" />
        <span className="my-auto product-button-button-3">Getting Started</span>
      </button>
      <a
        href="https://discord.com/invite/sevxWsqpGh"
        className="flex gap-x-2 py-1.5 px-2 hover:bg-semantic-bg-alt-primary rounded"
        rel="noopener noreferrer"
        target="_blank"
      >
        <Icons.HelpCircle className="h-3 w-3 stroke-semantic-fg-disabled" />
        <div className="my-auto product-button-button-3">Support</div>
      </a>
      <a
        href="https://www.instill.tech/docs"
        className="flex gap-x-2 py-1.5 px-2 hover:bg-semantic-bg-alt-primary rounded"
        rel="noopener noreferrer"
        target="_blank"
      >
        <Icons.File06 className="h-3 w-3 stroke-semantic-fg-disabled" />
        <div className="my-auto product-button-button-3">Documentation</div>
      </a>
    </div>
  );
};
