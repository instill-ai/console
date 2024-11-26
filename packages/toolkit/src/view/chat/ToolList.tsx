"use client";

import * as React from "react";
import { SuggestionOptions, SuggestionProps } from "@tiptap/suggestion";

import { cn, Icons } from "@instill-ai/design-system";

import { InstillStore, useInstillStore, useShallow } from "../../lib";

export type ToolSuggestion = {
  id: string;
};

export type ToolListRef = {
  // For convenience using this SuggestionList from within the
  // mentionSuggestionOptions, we'll match the signature of SuggestionOptions's
  // `onKeyDown` returned in its `render` function
  onKeyDown: NonNullable<
    ReturnType<
      NonNullable<SuggestionOptions<ToolSuggestion>["render"]>
    >["onKeyDown"]
  >;
};

export type ToolListProps = SuggestionProps<ToolSuggestion>;

const selector = (state: InstillStore) => ({
  enabledTools: state.enabledTools,
  updateEnabledTools: state.updateEnabledTools,
  enableToolSuggestion: state.enableToolSuggestion,
  updateEnableToolSuggestion: state.updateEnableToolSuggestion,
});

export const ToolList = React.forwardRef<ToolListRef, ToolListProps>(
  (props, ref) => {
    const {
      enabledTools,
      updateEnabledTools,
      enableToolSuggestion,
      updateEnableToolSuggestion,
    } = useInstillStore(useShallow(selector));

    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => setSelectedIndex(0), [props.items]);

    // Click outside handler
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          // Close the dropdown by sending empty command
          updateEnableToolSuggestion(() => false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [props.command]);

    React.useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === "ArrowUp") {
          console.log("ArrowUp");
          upHandler();
          return true;
        }

        if (event.key === "ArrowDown") {
          downHandler();
          return true;
        }

        if (event.key === "Enter") {
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    const [selectedIndex, setSelectedIndex] = React.useState(0);

    if (!props.clientRect || !props.clientRect() || !enableToolSuggestion) {
      return null;
    }

    const rect = props.clientRect();

    console.log("rect", props.clientRect());

    const selectItem = (index: number) => {
      const item = props.items[index];

      if (item) {
        if (!enabledTools.includes(item.id)) {
          updateEnabledTools((prev) => [...prev, item.id]);
        }
        props.command({ id: item.id });
      }
    };

    const upHandler = () => {
      setSelectedIndex(
        (selectedIndex + props.items.length - 1) % props.items.length,
      );
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    return (
      <div
        ref={dropdownRef}
        className="-translate-y-full absolute py-1 px-1.5 z-50 flex flex-col gap-y-2 shadow-md border border-semantic-bg-line bg-semantic-bg-primary"
        style={
          rect
            ? {
                top: rect.top - 12,
                left: props.clientRect()?.left,
              }
            : undefined
        }
      >
        {props.items.length ? (
          props.items.map((item, index) => (
            <button
              className={cn(
                "flex flex-row px-2.5 items-center gap-x-2 py-[9px] product-body-text-3-medium text-semantic-fg-primary",
                index === selectedIndex ? "bg-semantic-accent-bg" : "",
              )}
              key={index}
              onClick={() => selectItem(index)}
            >
              <div className="flex flex-row w-full gap-x-2">
                <Icons.Pipeline className="w-4 h-4 stroke-semantic-accent-default" />
                {item.id}
              </div>
              {enabledTools.includes(item.id) ? (
                <Icons.Check className="w-4 h-4 stroke-semantic-accent-default" />
              ) : null}
            </button>
          ))
        ) : (
          <div className="item">No result</div>
        )}
      </div>
    );
  },
);

ToolList.displayName = "ToolList";
