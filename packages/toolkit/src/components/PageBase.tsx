"use client";

import * as React from "react";
import cn from "clsx";

export const PageBase = ({ children }: { children: React.ReactNode }) => {
  return <div className="min-w-screen min-h-screen">{children}</div>;
};

const Container = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex h-full w-full flex-1">{children}</div>;
};

const Content = ({
  children,
  contentPadding,
}: {
  children: React.ReactNode;
  contentPadding?: string;
}) => {
  return (
    <div className="flex flex-1 bg-semantic-bg-alt-primary">
      <div
        className={cn(
          "h-[calc(100vh-var(--topbar-controller-height)-var(--topbar-nav-height))] w-screen min-w-[927px] overflow-y-scroll",
          contentPadding ? contentPadding : "p-20",
        )}
      >
        {children}
      </div>
    </div>
  );
};

PageBase.Container = Container;
PageBase.Content = Content;
