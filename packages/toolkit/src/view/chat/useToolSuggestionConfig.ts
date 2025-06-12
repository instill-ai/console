import { MentionOptions } from "@tiptap/extension-mention";
import { ReactRenderer } from "@tiptap/react";

import { InstillStore, useInstillStore, useShallow } from "../../lib";
import { ToolList, ToolListRef } from "./ToolList";

const selector = (state: InstillStore) => ({
  updateEnableToolSuggestion: state.updateEnableToolSuggestion,
});

export const useToolSuggestionConfig = () => {
  const { updateEnableToolSuggestion } = useInstillStore(useShallow(selector));

  const config: MentionOptions["suggestion"] = {
    items: ({ query }) => {
      return [
        {
          id: "ask-lead-tool",
        },
        {
          id: "search-web",
        },
        {
          id: "find-lead",
        },
        {
          id: "find-leads-by-companies",
        },
        {
          id: "find-companies",
        },
        {
          id: "write-to-sheets",
        },
      ]
        .filter((item) => item.id.toLowerCase().startsWith(query.toLowerCase()))
        .slice(0, 5);
    },
    render: () => {
      let component: ReactRenderer<ToolListRef> | undefined;

      return {
        onStart: (props) => {
          const element = document.getElementById("tool-suggestion");
          if (!element) return;

          component = new ReactRenderer(ToolList, {
            props,
            editor: props.editor,
          });

          element.appendChild(component.element);
          updateEnableToolSuggestion(() => true);
        },
        onUpdate(props) {
          component?.updateProps(props);
          updateEnableToolSuggestion(() => true);
        },

        onKeyDown(props) {
          if (props.event.key === "Escape") {
            component?.updateProps({
              props,
            });

            updateEnableToolSuggestion(() => false);

            return true;
          }

          if (!component?.ref) {
            return false;
          }

          // This will pass the keydown event to the ToolList component
          // And in the ToolList component, we will check if the keydown event
          // This can help us better control the keydown event when the ToolList
          // is active
          return component.ref.onKeyDown(props);
        },
        onExit() {
          component?.destroy();
          updateEnableToolSuggestion(() => false);
        },
      };
    },
  };

  return config;
};
