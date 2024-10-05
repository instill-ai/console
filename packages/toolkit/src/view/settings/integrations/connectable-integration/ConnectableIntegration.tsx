"use client";

import * as React from "react";
import Image from "next/image";
import { Integration, Nullable } from "instill-sdk";

import { Button } from "@instill-ai/design-system";

import { initializeIntegrationConnection } from "../../../../lib";
import { isOAuthAvailable } from "../../../../lib/integrations/helpers";
import { IntegrationProvider } from "../../../../server";
import { ManualSettingDialog } from "./ManualSettingDialog";

export type ConnectableIntegrationProps = {
  integration: Integration;
  namespaceId: Nullable<string>;
};

export const ConnectableIntegration = ({
  integration,
  namespaceId,
}: ConnectableIntegrationProps) => {
  const [isConnectDialogOpen, setIsConnectDialogOpen] = React.useState(false);

  const oAuthIsAvailable = isOAuthAvailable(integration.id);

  return (
    <div className="[&:not(:last-child)]:border-b [&:not(:last-child)]:border-semantic-bg-line flex flex-row gap-4 items-center p-4 w-full">
      <div className="w-12 h-12 rounded-sm border-semantic-bg-line border flex items-center justify-center">
        <Image
          width={24}
          height={24}
          src={`/icons/${integration.icon.split("/")[1]}`}
          alt={integration.title}
        />
      </div>
      <span className="text-semantic-fg-primary font-semibold text-base">
        {integration.title}
      </span>
      <Button
        variant="primary"
        className="ml-auto"
        onClick={() => {
          if (oAuthIsAvailable) {
            if (!namespaceId) {
              return;
            }

            let provider: Nullable<IntegrationProvider> = null;

            switch (integration.id) {
              case "github":
                provider = "github";
                break;
              case "slack":
                provider = "slack";
                break;
              default:
                break;
            }

            if (provider) {
              initializeIntegrationConnection({
                provider,
                namespaceId,
                integrationId: integration.id,
              });
            }

            return;
          }

          setIsConnectDialogOpen(true);
        }}
      >
        Connect
      </Button>
      <ManualSettingDialog
        isOpen={isConnectDialogOpen}
        onOpenChange={setIsConnectDialogOpen}
        namespaceId={namespaceId}
        integration={integration}
      />
    </div>
  );
};
