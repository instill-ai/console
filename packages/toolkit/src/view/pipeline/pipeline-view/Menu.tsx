import cn from "clsx";
import * as React from "react";
import { Nullable } from "../../../lib";

type MenuContextValue = {
  selectedValue: Nullable<string>;
  setSelectedValue?: (value: Nullable<string>) => void;
};

const MenuContext = React.createContext<MenuContextValue>({
  selectedValue: null,
});

const useMenuContext = () => {
  const context = React.useContext(MenuContext);
  if (context === undefined) {
    throw new Error(
      "useMenuContext must be used within a PipelineViewMenuProvider"
    );
  }
  return context;
};

const MenuRoot = ({
  children,
  defaultValue,
}: {
  children: React.ReactNode;
  defaultValue?: string;
}) => {
  const [selectedValue, setSelectedValue] = React.useState<Nullable<string>>(
    defaultValue ?? null
  );

  const context: MenuContextValue = React.useMemo(
    () => ({
      selectedValue,
      setSelectedValue: (value: Nullable<string>) => {
        setSelectedValue(value);
      },
    }),
    [selectedValue]
  );

  return (
    <MenuContext.Provider value={context}>
      <div className="flex h-8 flex-row gap-x-4">{children}</div>
    </MenuContext.Provider>
  );
};

const MenuItem = (
  props: {
    children: React.ReactNode;
    value: string;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
) => {
  const { children, value, onClick, ...passThrough } = props;

  const { selectedValue, setSelectedValue } = useMenuContext();

  return (
    <button
      {...passThrough}
      className={cn(
        "h-8 border-b-4 border-opacity-0 product-button-button-3 hover:bg-semantic-accent-bg-alt",
        selectedValue === value
          ? "border-semantic-accent-default border-opacity-100 text-semantic-fg-primary"
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

export const Menu = {
  Root: MenuRoot,
  Item: MenuItem,
};
