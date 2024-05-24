"use client";

import cn from "clsx";
import * as React from "react";
import { Nullable } from "../../types/general";

type TabMenuContextValue = {
  selectedValue: Nullable<string>;
  disabledDeSelect: boolean;
  setSelectedValue?: (value: Nullable<string>) => void;
};

const TabMenuContext = React.createContext<TabMenuContextValue>({
  selectedValue: null,
  disabledDeSelect: false,
});

const useTabMenuContext = () => {
  const context = React.useContext(TabMenuContext);
  if (context === undefined) {
    throw new Error("useTabMenuContext must be used within a TabMenuProvider");
  }
  return context;
};

const TabMenuRoot = ({
  children,
  className,
  value,
  onValueChange,
  disabledDeSelect,
}: {
  children: React.ReactNode;
  value: Nullable<string>;
  onValueChange: (value: Nullable<string>) => void;
  className?: string;
  disabledDeSelect?: boolean;
}) => {
  const context: TabMenuContextValue = React.useMemo(
    () => ({
      selectedValue: value,
      disabledDeSelect: disabledDeSelect ?? false,
      setSelectedValue: (value: Nullable<string>) => {
        onValueChange(value);
      },
    }),
    [value, onValueChange, disabledDeSelect]
  );

  return (
    <TabMenuContext.Provider value={context}>
      <div className={cn("flex h-8 flex-row gap-x-4", className)}>
        {children}
      </div>
    </TabMenuContext.Provider>
  );
};

const TabMenuItem = (
  props: {
    children: React.ReactNode;
    value: string;
    className?: string;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
) => {
  const { children, className, value, onClick, ...passThrough } = props;

  const { selectedValue, setSelectedValue, disabledDeSelect } =
    useTabMenuContext();

  return (
    <button
      {...passThrough}
      className={cn(
        "h-8 border-b-4 border-[#1D2433] border-opacity-0 text-semantic-fg-disabled product-button-button-3 hover:bg-semantic-accent-bg-alt",
        "data-[selected=true]:border-semantic-accent-default data-[selected=true]:border-opacity-100 data-[selected=true]:text-semantic-fg-primary",
        className
      )}
      data-selected={selectedValue === value}
      onClick={(e) => {
        onClick?.(e);

        if (setSelectedValue) {
          if (selectedValue === value && !disabledDeSelect) {
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

export const TabMenu = {
  Root: TabMenuRoot,
  Item: TabMenuItem,
};
