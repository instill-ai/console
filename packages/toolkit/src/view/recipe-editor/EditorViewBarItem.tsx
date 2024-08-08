"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Nullable } from "instill-sdk";

import { cn, Icons } from "@instill-ai/design-system";

import { EditorViewType } from "../../lib";

export const EditorViewBarItem = ({
  id,
  title,
  type,
  currentViewId,
  onClick,
}: {
  id: string;
  title: string;
  type: EditorViewType;
  currentViewId: Nullable<string>;
  onClick: (id: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
  });

  const style = {
    transform: transform
      ? CSS.Transform.toString({
          x: transform.x,
          y: transform.y,
          scaleX: 1,
          scaleY: 1,
        })
      : undefined,
    transition,
  };

  let icon: React.ReactNode = null;

  switch (type) {
    case "preview":
      icon = <Icons.Eye className="w-4 h-4 stroke-semantic-fg-secondary" />;
  }

  return (
    <div
      {...attributes}
      className={cn(
        "first:rounded-tl cursor-pointer",
        currentViewId === id
          ? "bg-semantic-bg-alt-primary"
          : "bg-semantic-bg-line",
      )}
      onClick={() => onClick(id)}
      ref={setNodeRef}
      style={style}
      key={id}
    >
      <button
        {...listeners}
        ref={setActivatorNodeRef}
        className="flex border-r border-semantic-bg-line flex-row gap-x-2 px-2 h-8 items-center"
      >
        {icon}
        <p className="text-[13px] font-sans text-semantic-fg-primary">
          {title}
        </p>
      </button>
    </div>
  );
};
