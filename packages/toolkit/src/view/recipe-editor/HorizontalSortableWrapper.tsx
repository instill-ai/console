"use client";

import * as React from "react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";

import { EditorView } from "../../lib";

export const HorizontalSortableWrapper = ({
  onDragEnd,
  children,
  items,
  onDragOver,
  onDragStart,
}: {
  onDragEnd?: (event: DragEndEvent) => void;
  onDragStart?: (event: DragStartEvent) => void;
  onDragOver?: (event: DragOverEvent) => void;
  children: React.ReactNode;
  items: EditorView[];
}) => {
  // This will allow the user to click the items without activating the drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      modifiers={[restrictToHorizontalAxis]}
      autoScroll={true}
    >
      <SortableContext
        strategy={horizontalListSortingStrategy}
        items={items.map((item) => ({ id: item.id }))}
      >
        {children}
      </SortableContext>
    </DndContext>
  );
};
