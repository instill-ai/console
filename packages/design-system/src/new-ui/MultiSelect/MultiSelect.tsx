"use client";

import * as React from "react";
import cn from "clsx";
import { Command } from "../Command";
import { Popover } from "../Popover";
import { Icons } from "../Icons";
import { Nullable, SelectOption } from "../../types/general";
import { Button } from "../Button";
import { Tag } from "../Tag";

type ComboboxProps = {
  placeholder: React.ReactElement;
  options: SelectOption[];
  setOptions?: React.Dispatch<React.SetStateAction<SelectOption[]>>;
  selectedOptions: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
  createOnNotFound?: boolean;
  emptyPlaceholder?: string;
};

export function MultiSelect({
  placeholder,
  emptyPlaceholder,
  options,
  setOptions,
  selectedOptions,
  onChange,
  createOnNotFound,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState<Nullable<string>>(null);

  const handleUnselect = (item: string) => {
    onChange(selectedOptions.filter((i) => i !== item));
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          variant="secondaryGrey"
          className={cn(
            "w-full justify-between",
            selectedOptions.length > 0 ? "h-full" : "h-10"
          )}
        >
          {selectedOptions.length > 0 ? (
            <div className="flex flex-row flex-wrap gap-1">
              {selectedOptions.map((option) => (
                <Tag
                  key={option}
                  variant="lightBlue"
                  size="sm"
                  className="flex flex-row gap-x-1"
                >
                  {option}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleUnselect(option);
                    }}
                  >
                    <Icons.X className="h-3 w-3 stroke-semantic-fg-secondary" />
                  </button>
                </Tag>
              ))}
            </div>
          ) : (
            placeholder
          )}
        </Button>
      </Popover.Trigger>
      <Popover.Content className="w-[var(--radix-popover-trigger-width)] !rounded-sm !p-0">
        <Command.Root>
          <Command.Input
            value={searchValue ?? ""}
            onValueChange={(search) => {
              setSearchValue(search);
            }}
            placeholder="Search..."
          />
          <Command.Empty className="!p-2">
            {createOnNotFound ? (
              <Button
                variant="secondaryColour"
                size="sm"
                className="!w-full !text-semantic-fg-secondary !product-body-text-3-medium"
                onClick={() => {
                  if (!setOptions) {
                    throw new Error("setOptions is not defined");
                  }
                  if (!searchValue || selectedOptions.includes(searchValue)) {
                    return;
                  }
                  onChange([...selectedOptions, searchValue]);
                  setOptions([
                    ...options,
                    { value: searchValue, label: searchValue },
                  ]);
                  setOpen(true);
                }}
              >{`${emptyPlaceholder} ${searchValue}`}</Button>
            ) : (
              emptyPlaceholder
            )}
          </Command.Empty>
          <Command.Group>
            {options.map((option) => (
              <Command.Item
                key={option.value}
                onSelect={() => {
                  onChange(
                    selectedOptions.includes(option.value)
                      ? selectedOptions.filter((item) => item !== option.value)
                      : [...selectedOptions, option.value]
                  );
                  setOpen(true);
                }}
              >
                <Icons.Check
                  className={cn(
                    "h-4 w-4 stroke-semantic-fg-secondary",
                    selectedOptions.includes(option.value)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {option.startIcon}
                {option.label}
              </Command.Item>
            ))}
          </Command.Group>
        </Command.Root>
      </Popover.Content>
    </Popover.Root>
  );
}
