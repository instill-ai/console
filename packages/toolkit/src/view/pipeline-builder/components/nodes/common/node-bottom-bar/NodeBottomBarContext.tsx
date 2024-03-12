"use client";

import * as React from "react";
import { Nullable } from "../../../../../../lib";

export type NodeBottomBarMenuVelue = "output" | "schema";

type NodeBottomBarContextValue = {
  selectedValue: Nullable<NodeBottomBarMenuVelue>;
  setSelectedValue?: React.Dispatch<
    React.SetStateAction<Nullable<NodeBottomBarMenuVelue>>
  >;
};

const NodeBottomBarContext = React.createContext<NodeBottomBarContextValue>({
  selectedValue: null,
});

export const useNodeBottomBarContext = () => {
  const context = React.useContext(NodeBottomBarContext);
  if (context === undefined) {
    throw new Error(
      "useNodeBottomBarContext must be used within a BottomBarProvider"
    );
  }
  return context;
};

export const NodeBottomBarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedValue, setSelectedValue] =
    React.useState<Nullable<NodeBottomBarMenuVelue>>(null);

  const context: NodeBottomBarContextValue = React.useMemo(
    () => ({
      selectedValue,
      setSelectedValue,
    }),
    [selectedValue]
  );

  return (
    <NodeBottomBarContext.Provider value={context}>
      {children}
    </NodeBottomBarContext.Provider>
  );
};
