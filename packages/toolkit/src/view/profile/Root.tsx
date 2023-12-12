import * as React from "react";

export const ProfileRoot = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full flex-row gap-x-6 pl-20 pr-28">{children}</div>
  );
};
