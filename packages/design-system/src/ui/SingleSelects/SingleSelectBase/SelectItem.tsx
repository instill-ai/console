import cn from "clsx";
import * as Select from "@radix-ui/react-select";
import * as React from "react";
import { CheckIcon } from "../../Icons";
import { Nullable, SelectOption } from "../../../types/general";

export type SelectItemProps = {
  width: Nullable<number>;
  selectItemTextIconGap: string;
  option: SelectOption;
};

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ option, width, selectItemTextIconGap }, forwardedRef) => {
    return (
      <Select.Item
        className="relative flex w-full flex-row py-2 pl-5 pr-12 data-[highlighted]:border-0 data-[highlighted]:bg-instillGrey05 data-[highlighted]:outline-none data-[highlighted]:ring-0"
        value={option.value}
        ref={forwardedRef}
        style={{ width: width ? `${width}px` : undefined }}
        data-testid={`select-item-${option.value}`}
      >
        <Select.ItemIndicator className="absolute right-5 top-1/2 w-6 -translate-y-1/2">
          <CheckIcon
            width="w-4"
            height="h-4"
            color="fill-semantic-node-disconnected-default-stroke"
            position="my-auto"
          />
        </Select.ItemIndicator>
        <div className={cn("flex flex-row", selectItemTextIconGap)}>
          {option.startIcon ? option.startIcon : null}
          <Select.ItemText className="align-middle">
            {option.label}
          </Select.ItemText>
          {option.endIcon ? option.endIcon : null}
        </div>
      </Select.Item>
    );
  }
);

SelectItem.displayName = "SelectItem";
