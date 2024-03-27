"use client";

import * as React from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { GeneralRecord } from "../../../lib";

type SortableItem = {
  key: string;
} & GeneralRecord;

export const VerticalSortableWrapper = ({
  onDragEnd,
  children,
  items,
  onDragOver,
  onDragStart,
}: {
  onDragEnd: (event: DragEndEvent) => void;
  onDragStart?: (event: DragStartEvent) => void;
  onDragOver?: (event: DragOverEvent) => void;
  children: React.ReactNode;
  items: SortableItem[];
}) => {
  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      modifiers={[restrictToVerticalAxis]}
      autoScroll={false}
    >
      <SortableContext
        strategy={verticalListSortingStrategy}
        items={items.map((item) => ({ id: item.key }))}
      >
        {children}
      </SortableContext>
    </DndContext>
  );
};
