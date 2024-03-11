"use client";

import * as React from "react";

import { Nullable } from "../../../lib";

export type PipelineViewContextValue = {
  currentVersion: Nullable<string>;
  setCurrentVersion?: React.Dispatch<React.SetStateAction<Nullable<string>>>;
};

export const defaultPipelineViewContextValue: PipelineViewContextValue = {
  currentVersion: null,
};

const PipelineViewContext = React.createContext(
  defaultPipelineViewContextValue
);

PipelineViewContext.displayName = "PipelineViewContext";

export const usePipelineViewCtx = () => React.useContext(PipelineViewContext);

export const PipelineViewProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentVersion, setCurrentVersion] =
    React.useState<Nullable<string>>(null);

  return (
    <PipelineViewContext.Provider value={{ currentVersion, setCurrentVersion }}>
      {children}
    </PipelineViewContext.Provider>
  );
};
