import { Nullable } from "@instill-ai/toolkit";
import * as React from "react";

type TableCellProps = {
  iconElement: Nullable<React.ReactElement>;
  primaryText: Nullable<string>;
  secondaryText: Nullable<string>;
};

function TableCell({
  iconElement,
  primaryText,
  secondaryText,
}: TableCellProps) {
  return (
    <div className="flex flex-row items-center gap-x-3">
      {iconElement && (
        <div className="h-8 w-8 rounded-lg bg-semantic-bg-secondary p-2 ">
          {iconElement}
        </div>
      )}
      <div className="flex flex-col">
        {primaryText && (
          <h1 className="text-semantic-fg-primary product-body-text-3-semibold">
            {primaryText}
          </h1>
        )}
        {secondaryText && (
          <p className="text-semantic-fg-disabled product-body-text-3-regular">
            {secondaryText}
          </p>
        )}
      </div>
    </div>
  );
}

export { TableCell };
