import cn from "clsx";
import * as React from "react";
import { Nullable } from "../../../lib";

type NodeBottomBarContextValue = {
  selectedValue: Nullable<string>;
  setSelectedValue?: (value: Nullable<string>) => void;
};

const NodeBottomBarContext = React.createContext<NodeBottomBarContextValue>({
  selectedValue: null,
});

const useNodeBottomBarContext = () => {
  const context = React.useContext(NodeBottomBarContext);
  if (context === undefined) {
    throw new Error(
      "useNodeBottomBarContext must be used within a BottomBarProvider"
    );
  }
  return context;
};

const BottomBarProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedValue, setSelectedValue] =
    React.useState<Nullable<string>>(null);

  const context: NodeBottomBarContextValue = React.useMemo(
    () => ({
      selectedValue,
      setSelectedValue: (value: Nullable<string>) => {
        setSelectedValue(value);
      },
    }),
    [selectedValue]
  );

  return (
    <NodeBottomBarContext.Provider value={context}>
      {children}
    </NodeBottomBarContext.Provider>
  );
};

const NodeBottomBarRoot = ({ children }: { children: React.ReactNode }) => {
  return (
    <BottomBarProvider>
      <div className="flex h-6 flex-row rounded-b-[6px] border-t border-semantic-bg-line bg-[#F0F0F0] px-2">
        {children}
      </div>
    </BottomBarProvider>
  );
};

const NodeBottomBarItem = (
  props: {
    children: React.ReactNode;
    value: string;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
) => {
  const { children, value, onClick, ...passThrough } = props;

  const { selectedValue, setSelectedValue } = useNodeBottomBarContext();

  return (
    <button
      {...passThrough}
      className={cn(
        "h-full border-b border-[#1D2433] border-opacity-0 px-1.5 py-1.5 font-sans text-[10px] font-semibold hover:bg-semantic-bg-line",
        selectedValue === value
          ? "border-opacity-100 text-semantic-fg-primary"
          : "text-semantic-fg-disabled"
      )}
      onClick={(e) => {
        onClick?.(e);

        if (setSelectedValue) {
          if (selectedValue === value) {
            setSelectedValue(null);
          } else {
            setSelectedValue(value);
          }
        }
      }}
    >
      {children}
    </button>
  );
};

export const NodeBottomBar = {
  Root: NodeBottomBarRoot,
  Item: NodeBottomBarItem,
};
