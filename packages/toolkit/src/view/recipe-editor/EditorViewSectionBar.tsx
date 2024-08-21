"use client";

import { DragEndEvent } from "@dnd-kit/core";
import { Nullable } from "instill-sdk";

import { Icons } from "@instill-ai/design-system";

import { EditorView } from "../../lib";
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
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
  currentViewId: Nullable<string>;
}) => {
  return (
    <div className="flex overflow-x-auto flex-row rounded-t h-8 pr-1 bg-semantic-bg-base-bg box-border border-b border-semantic-bg-line">
      <HorizontalSortableWrapper items={views} onDragEnd={onDragEnd}>
        <div className="flex flex-1 flex-row w-full">
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
      <button className="ml-auto" onClick={onToggleExpand}>
        {isExpanded ? (
          <Icons.Minimize01 className="w-3 h-3 stroke-semantic-fg-primary" />
        ) : (
          <Icons.Expand01 className="w-3 h-3 stroke-semantic-fg-primary" />
        )}
      </button>
    </div>
  );
};
