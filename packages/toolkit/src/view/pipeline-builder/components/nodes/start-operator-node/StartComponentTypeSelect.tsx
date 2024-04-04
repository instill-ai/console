"use client";

import cn from "clsx";
import * as React from "react";
import { Nullable, useInstillStore } from "../../../../../lib";
import { Select } from "@instill-ai/design-system";
import { StartComponentFields } from "./StartComponentFields";

export const StartComponentTypeSelect = ({
  id,
  selectedType,
  setSelectedType,
  className,
}: {
  selectedType: Nullable<string>;
  setSelectedType: React.Dispatch<React.SetStateAction<Nullable<string>>>;
  className?: string;
  id: string;
}) => {
  const recentlyUsedStartComponentFieldTypes = useInstillStore(
    (store) => store.recentlyUsedStartComponentFieldTypes
  );

  const recentlyUsedTypes = React.useMemo(() => {
    return Object.entries(StartComponentFields)
      .filter(([key]) => recentlyUsedStartComponentFieldTypes.includes(key))
      .sort((a, b) => a[1].order - b[1].order);
  }, [recentlyUsedStartComponentFieldTypes]);

  return (
    <Select.Root
      value={selectedType ?? "string"}
      onValueChange={(value) => {
        setSelectedType(value);
      }}
    >
      <Select.Trigger id={id} className={cn("w-full !py-1", className)}>
        <Select.Value placeholder="Select..." />
      </Select.Trigger>
      <Select.Content viewportClassName="!p-0" className="!p-2">
        {recentlyUsedTypes.length > 0 ? (
          <Select.Group className="mb-2">
            <Select.Label className="mb-2 !p-0 !text-semantic-fg-disabled !product-body-text-4-semibold">
              Recently Used
            </Select.Label>
            <div className="flex flex-col gap-y-2">
              {recentlyUsedTypes.map(([key, field]) => (
                <Select.Item
                  key={key}
                  className={cn(
                    "!px-1 !py-0 data-[highlighted]:!rounded data-[highlighted]:!bg-[#F1F3F9] data-[highlighted]:!stroke-semantic-fg-primary",
                    selectedType === key ? "bg-[#F1F3F9]" : ""
                  )}
                  value={key}
                  disabledCheck={true}
                >
                  <div className="flex flex-row gap-x-1 rounded-full bg-[#F1F3F9] px-1.5 py-1">
                    {field.icon}
                    <p className="text-semantic-fg-primary product-button-button-2">
                      {field.title}
                    </p>
                  </div>
                </Select.Item>
              ))}
            </div>
          </Select.Group>
        ) : null}
        <Select.Group>
          <Select.Label className="mb-2 !p-0 !text-semantic-fg-disabled !product-body-text-4-semibold">
            All
          </Select.Label>
          <div className="flex flex-col gap-y-2">
            {Object.entries(StartComponentFields)
              .filter(
                ([key]) => !recentlyUsedStartComponentFieldTypes.includes(key)
              )
              .sort((a, b) => a[1].order - b[1].order)
              .map(([key, field]) => (
                <Select.Item
                  key={key}
                  className={cn(
                    "!px-1 !py-0 data-[highlighted]:!rounded data-[highlighted]:!bg-[#F1F3F9] data-[highlighted]:!stroke-semantic-fg-primary",
                    selectedType === key ? "bg-[#F1F3F9]" : ""
                  )}
                  value={key}
                  disabledCheck={true}
                >
                  <div className="flex flex-row gap-x-1 rounded-full bg-[#F1F3F9] px-1.5 py-1">
                    {field.icon}
                    <p className="text-semantic-fg-primary product-button-button-2">
                      {field.title}
                    </p>
                  </div>
                </Select.Item>
              ))}
          </div>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};
