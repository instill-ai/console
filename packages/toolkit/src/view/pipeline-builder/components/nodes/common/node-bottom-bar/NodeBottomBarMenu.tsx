"use client";

import cn from "clsx";
import * as React from "react";
import { useNodeBottomBarContext } from "./NodeBottomBarContext";
import { useInstillStore } from "../../../../../../lib";

const NodeBottomBarMenuRootPrimitive = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex h-6 flex-row rounded-b-[6px] border-t border-semantic-bg-line bg-[#F0F0F0] px-2">
      {children}
    </div>
  );
};

const NodeBottomBarMenuItemPrimitive = (
  props: {
    children: React.ReactNode;
    value: string;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
) => {
  const { children, value, onClick, ...passThrough } = props;

  const { selectedValue } = useNodeBottomBarContext();

  return (
    <button
      {...passThrough}
      className={cn(
        "h-full border-b border-[#1D2433] border-opacity-0 px-1.5 py-1.5 font-sans text-[10px] font-semibold hover:bg-semantic-bg-line",
        selectedValue === value
          ? "border-opacity-100 text-semantic-fg-primary"
          : "text-semantic-fg-disabled"
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const NodeBottomBarMenuPrimitive = {
  Root: NodeBottomBarMenuRootPrimitive,
  Item: NodeBottomBarMenuItemPrimitive,
};

export const NodeBottomBarMenu = () => {
  const { setSelectedValue } = useNodeBottomBarContext();
  const pipelineIsReadOnly = useInstillStore(
    (store) => store.pipelineIsReadOnly
  );

  return (
    <NodeBottomBarMenuPrimitive.Root>
      <NodeBottomBarMenuPrimitive.Item
        value="output"
        onClick={() => {
          if (pipelineIsReadOnly || !setSelectedValue) return;
          setSelectedValue((prev) => {
            if (prev === "output") return null;
            return "output";
          });
        }}
      >
        Output
      </NodeBottomBarMenuPrimitive.Item>
      <NodeBottomBarMenuPrimitive.Item
        value="schema"
        onClick={() => {
          if (pipelineIsReadOnly || !setSelectedValue) return;
          setSelectedValue((prev) => {
            if (prev === "schema") return null;
            return "schema";
          });
        }}
      >
        Schema
      </NodeBottomBarMenuPrimitive.Item>
    </NodeBottomBarMenuPrimitive.Root>
  );
};
