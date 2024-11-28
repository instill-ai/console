"use client";

import { BreadcrumbWithLink, BreadcrumbWithLinkProps } from "../../components";

export const SettingRoot = ({
  children,
  breadcrumbItems,
}: {
  children: React.ReactNode;
  breadcrumbItems: BreadcrumbWithLinkProps["items"];
}) => {
  return (
    <div className="flex flex-col px-20">
      <div className="mb-8 w-full">
        <BreadcrumbWithLink className="mb-0" items={breadcrumbItems} />
      </div>
      <div className="flex flex-row gap-x-6">{children}</div>
    </div>
  );
};
