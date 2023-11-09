import * as React from "react";
import Link from "next/link";
import { Nullable } from "../../lib";

type TableCellProps = {
  iconElement: Nullable<React.ReactElement>;
  primaryText: Nullable<string>;
  secondaryText: Nullable<string>;
  primaryLink: Nullable<string>;
  secondaryLink: Nullable<string>;
};

function TableCell({
  iconElement,
  primaryText,
  secondaryText,
  primaryLink,
  secondaryLink,
}: TableCellProps) {
  return (
    <div className="flex flex-row items-center gap-x-3">
      {iconElement && (
        <div className="h-8 w-8 rounded-lg bg-semantic-bg-secondary p-2 ">
          {iconElement}
        </div>
      )}
      <div className="flex flex-col">
        {primaryText && primaryLink ? (
          <Link href={primaryLink} className="hover:underline">
            <h3 className="text-semantic-fg-primary product-body-text-3-semibold">
              {primaryText}
            </h3>
          </Link>
        ) : (
          <h3 className="text-semantic-fg-primary product-body-text-3-semibold">
            {primaryText}
          </h3>
        )}

        {secondaryText && secondaryLink ? (
          <Link href={secondaryLink} className="hover:underline">
            <p className="text-semantic-fg-disabled product-body-text-3-regular">
              {secondaryText}
            </p>
          </Link>
        ) : (
          <p className="text-semantic-fg-disabled product-body-text-3-regular">
            {secondaryText}
          </p>
        )}
      </div>
    </div>
  );
}

export { TableCell };
