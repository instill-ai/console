"use client";

import { DragEndEvent } from "@dnd-kit/core";

import { Icons } from "@instill-ai/design-system";

import { EditorView } from "../../lib";
import { EditorViewBarItem } from "./EditorViewBarItem";
import { HorizontalSortableWrapper } from "./HorizontalSortableWrapper";

export const EditorViewSectionBar = ({
  views,
  isExpanded,
  onDragEnd,
  onToggleExpand,
}: {
  views: EditorView[];
  onDragEnd: (event: DragEndEvent) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) => {
  return (
    <div className="flex flex-row rounded h-8 pr-1 bg-semantic-bg-base-bg box-border border-b border-semantic-bg-line">
      <HorizontalSortableWrapper items={views} onDragEnd={onDragEnd}>
        <div className="flex flex-1 flex-row w-full">
          {views.map((view) => (
            <EditorViewBarItem
              key={view.id}
              id={view.id}
              title={view.title}
              type={view.type}
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
