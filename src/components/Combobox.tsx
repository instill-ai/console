"use client";

import * as React from "react";
import cn from "clsx";
import {
  SingleSelectOption,
  Popover,
  Command,
  Icons,
} from "@instill-ai/design-system";
import { Nullable } from "@instill-ai/toolkit";

type ComboboxProps = {
  items: SingleSelectOption[];
  placeholder: Nullable<string>;
  notFoundPlaceholder: Nullable<string>;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  label: React.ReactElement;
};

export function Combobox({
  items,
  placeholder,
  notFoundPlaceholder,
  label,
  value,
  setValue,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>{label}</Popover.Trigger>
      <Popover.Content
        className="w-[300px] !rounded-sm !p-0"
        side="bottom"
        align="start"
      >
        <Command.Root>
          <Command.Input placeholder={placeholder || ""} />
          <Command.Empty>{notFoundPlaceholder || ""}</Command.Empty>
          <Command.Group>
            {items.map((item) => (
              <Command.Item
                key={item.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : item.value);
                  setOpen(false);
                }}
              >
                <Icons.Check
                  className={cn(
                    "h-4 w-4 stroke-slate-500",
                    value === item.value ? "opacity-100" : "opacity-0"
                  )}
                />

                {item.startIcon}

                {item.label}
              </Command.Item>
            ))}
          </Command.Group>
        </Command.Root>
      </Popover.Content>
    </Popover.Root>
  );
}
