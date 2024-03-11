"use client";
import * as React from "react";
import { AmplitudeCtx } from "@instill-ai/toolkit";

export const AmplitudeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [amplitudeIsInit, setAmplitudeIsInit] = React.useState(false);
  return (
    <AmplitudeCtx.Provider value={{ amplitudeIsInit, setAmplitudeIsInit }}>
      {children}
    </AmplitudeCtx.Provider>
  );
};
