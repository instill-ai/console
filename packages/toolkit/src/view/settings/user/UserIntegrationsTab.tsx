"use client";

import * as React from "react";

import { Integrations, Setting } from "../..";

export const UserIntegrationsTab = () => {
  return (
    <Setting.TabRoot>
      <Setting.TabHeader
        title="Integration"
        description={
          <p className="text-semantic-fg-secondary product-body-text-3-regular">
            Easily configure and protect your connections.{" "}
            <a
              href="https://www.instill-ai.com/privacy"
              className="text-semantic-accent-default underline"
              target="_blank"
              rel="noreferrer noopener"
            >
              Learn more about data privacy
            </a>
            .
          </p>
        }
      />
      <React.Suspense>
        <Integrations />
      </React.Suspense>
    </Setting.TabRoot>
  );
};
