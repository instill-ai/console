import * as React from "react";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

type SortableItem = {
  key: string;
} & Record<string, any>;

export const VerticalSortableWrapper = ({
  onDragEnd,
  children,
  items,
}: {
  onDragEnd: (event: DragEndEvent) => void;
  children: React.ReactNode;
  items: SortableItem[];
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      modifiers={[restrictToVerticalAxis]}
      autoScroll={false}
    >
      <SortableContext
        items={items.map((item) => ({ id: item.key }))}
        // strategy={verticalListSortingStrategy}
      >
        {children}
      </SortableContext>
    </DndContext>
  );
};
