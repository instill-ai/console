import * as React from "react";

export const PageBase = ({ children }: { children: React.ReactNode }) => {
  return <div className="min-h-screen w-full">{children}</div>;
};

const Container = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-1">{children}</div>;
};

const Content = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-1 bg-semantic-bg-base-bg">
      <div className="h-[calc(100vh-var(--topbar-height))] w-full min-w-[927px] overflow-y-scroll p-20">
        {children}
      </div>
    </div>
  );
};

PageBase.Container = Container;
PageBase.Content = Content;
