"use client";

import React, { ReactElement } from "react";
import Link from "next/link";

import { cn, Icons } from "@instill-ai/design-system";

export type BreadcrumbWithLinkItem = {
  label: ReactElement | string;
  link?: string;
};

export type BreadcrumbWithLinkProps = {
  items: BreadcrumbWithLinkItem[];
  className?: string;
};

const BreadcrumbWithLink = ({ items, className }: BreadcrumbWithLinkProps) => {
  const activeLink = items.filter((_, index) => index != items.length - 1);
  return (
    <div className={cn("mb-4 flex items-center gap-x-2 text-sm", className)}>
      {activeLink.map((item) => (
        <React.Fragment key={item.link}>
          {item.link ? (
            <div className="flex gap-x-1">
              <div className="my-auto text-semantic-accent-default product-body-text-4-regular">
                <Link href={item.link}>{item.label}</Link>
              </div>
              <Icons.ChevronRight className="my-auto h-4 w-4 stroke-semantic-fg-disabled" />
            </div>
          ) : (
            <div className="flex gap-x-1">
              <div className="my-auto text-semantic-accent-default product-body-text-4-regular">
                <p>{item.label}</p>
              </div>
              <Icons.ChevronRight className="my-auto h-4 w-4 stroke-semantic-fg-disabled" />
            </div>
          )}
        </React.Fragment>
      ))}
      <div className="my-auto text-semantic-fg-disabled product-body-text-4-regular">
        {items[items.length - 1]?.label}
      </div>
    </div>
  );
};

export { BreadcrumbWithLink };
