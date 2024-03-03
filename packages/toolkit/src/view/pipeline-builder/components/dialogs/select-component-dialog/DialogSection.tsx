import { Icons } from "@instill-ai/design-system";
import * as React from "react";

export const DialogSectionRoot = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col">
      <div className="mb-4 flex w-full bg-semantic-bg-base-bg py-2">
        <p className="mx-auto product-body-text-1-semibold">{title}</p>
      </div>
      {children}
    </div>
  );
};

export const DialogSectionGrid = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="mb-4 grid w-full grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3 lg:grid-cols-4">
      {children}
    </div>
  );
};

export const DialogSectionSubTitle = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <h3 className="mb-4 text-semantic-fg-secondary product-body-text-3-medium">
      {children}
    </h3>
  );
};

export const DialogSectionItem = (
  props: {
    children: React.ReactNode;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
) => {
  const { children, onClick, ...passThrough } = props;
  return (
    <button
      className="flex w-[228px] cursor-pointer flex-row space-x-2 rounded border border-semantic-bg-line p-2 hover:bg-semantic-accent-bg"
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        }
      }}
      {...passThrough}
    >
      <div className="my-auto flex flex-1 flex-row space-x-2">{children}</div>
      <div className="my-auto flex h-8 w-8 items-center justify-center">
        <Icons.Plus className="h-4 w-4 stroke-semantic-fg-secondary" />
      </div>
    </button>
  );
};

export const DialogSection = {
  Root: DialogSectionRoot,
  Grid: DialogSectionGrid,
  SubTitle: DialogSectionSubTitle,
  Item: DialogSectionItem,
};
