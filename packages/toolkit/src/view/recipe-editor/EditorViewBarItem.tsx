"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Nullable } from "instill-sdk";

import { Button, cn, Icons } from "@instill-ai/design-system";

import { EditorViewType } from "../../lib";

export const EditorViewBarItem = ({
  id,
  title,
  type,
  currentViewId,
  onClick,
  onDelete,
  closeable,
}: {
  id: string;
  title: string;
  type: EditorViewType;
  currentViewId: Nullable<string>;
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
  closeable: boolean;
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
        "first:rounded-tl cursor-pointer shrink-0",
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
        className="flex relative border-r border-semantic-bg-line flex-row gap-x-2 px-2 h-8 items-center"
      >
        {icon}
        <p className="text-[13px] font-sans text-semantic-fg-primary">
          {title}
        </p>
        {closeable ? (
          <React.Fragment>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              variant="tertiaryGrey"
              className="!absolute z-50 top-1/2 -translate-y-1/2 right-2 !p-0 !w-4 h-4"
            >
              <Icons.X className="w-3 h-3 stroke-semantic-fg-secondary" />
            </Button>
            <div className="w-4 h-4 shrink-0 grow-0" />
          </React.Fragment>
        ) : null}
      </button>
    </div>
  );
};
