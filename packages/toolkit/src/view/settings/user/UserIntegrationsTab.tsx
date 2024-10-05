"use client";

import * as React from "react";

import { Integrations, Setting } from "../..";

export const UserIntegrationsTab = () => {
  return (
    <Setting.TabRoot>
      <Setting.TabHeader
        title="Integration"
        description="Easily configure and protect your connections"
      />
      <React.Suspense>
        <Integrations />
      </React.Suspense>
    </Setting.TabRoot>
  );
};
