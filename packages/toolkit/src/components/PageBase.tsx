"use client";

import * as React from "react";
import cn from "clsx";

export const PageBase = ({ children }: { children: React.ReactNode }) => {
  return <div className="min-w-screen min-h-screen">{children}</div>;
};

const Container = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-row h-full w-full flex-1">{children}</div>;
};

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="shrink-0 w-44 bg-semantic-bg-secondary ">{children}</div>
  );
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
          "h-[calc(100vh-var(--top-nav-height))] w-full overflow-y-scroll",
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
PageBase.Sidebar = Sidebar;
