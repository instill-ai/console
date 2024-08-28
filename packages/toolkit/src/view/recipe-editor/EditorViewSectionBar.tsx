"use client";

import { DragEndEvent } from "@dnd-kit/core";
import { Nullable } from "instill-sdk";

import { Icons } from "@instill-ai/design-system";

import { EditorView, EditorViewID } from "../../lib";
import { EditorButtonTooltipWrapper } from "./EditorButtonTooltipWrapper";
import { EditorViewBarItem } from "./EditorViewBarItem";
import { HorizontalSortableWrapper } from "./HorizontalSortableWrapper";

export const EditorViewSectionBar = ({
  views,
  isExpanded,
  onDragEnd,
  onToggleExpand,
  onClick,
  currentViewId,
  onDelete,
}: {
  views: EditorView[];
  onDragEnd: (event: DragEndEvent) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onClick: (id: EditorViewID) => void;
  onDelete: (id: EditorViewID) => void;
  currentViewId: Nullable<EditorViewID>;
}) => {
  return (
    <div className="flex flex-row rounded-t min-h-8 pr-1 bg-semantic-bg-base-bg box-border border-b border-semantic-bg-line">
      <HorizontalSortableWrapper items={views} onDragEnd={onDragEnd}>
        <div
          className="flex flex-1 flex-row w-full overflow-x-auto overflow-y-hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {views.map((view) => (
            <EditorViewBarItem
              key={view.id}
              id={view.id}
              title={view.title}
              type={view.type}
              onClick={onClick}
              currentViewId={currentViewId}
              closeable={view.closeable}
              onDelete={onDelete}
            />
          ))}
        </div>
      </HorizontalSortableWrapper>
      <button className="ml-auto px-2" onClick={onToggleExpand}>
        {isExpanded ? (
          <EditorButtonTooltipWrapper tooltipContent="Restore pane">
            <Icons.Minimize01 className="w-3 h-3 stroke-semantic-fg-primary" />
          </EditorButtonTooltipWrapper>
        ) : (
          <EditorButtonTooltipWrapper tooltipContent="Maximize pane">
            <Icons.Expand01 className="w-3 h-3 stroke-semantic-fg-primary" />
          </EditorButtonTooltipWrapper>
        )}
      </button>
    </div>
  );
};
