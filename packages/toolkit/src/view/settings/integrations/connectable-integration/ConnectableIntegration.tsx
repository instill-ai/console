"use client";

import * as React from "react";
import Image from "next/image";
import { Integration, Nullable } from "instill-sdk";

import { Button } from "@instill-ai/design-system";

import { LoadingSpin } from "../../../../components";
import {
  getInstillAPIClient,
  initializeIntegrationConnection,
  toastInstillError,
  useQueryClient,
} from "../../../../lib";
import { isOAuthAvailable } from "../../../../lib/integrations/helpers";
import { queryKeyStore } from "../../../../lib/react-query-service/queryKeyStore";
import { IntegrationProvider } from "../../../../server";
import { ManualSettingDialog } from "./ManualSettingDialog";

export type ConnectableIntegrationProps = {
  integration: Integration;
  namespaceId: Nullable<string>;
  accessToken: Nullable<string>;
};

export const ConnectableIntegration = ({
  integration,
  namespaceId,
  accessToken,
}: ConnectableIntegrationProps) => {
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [editingDialogIsOpen, setEditingDialogIsOpen] = React.useState(false);

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
        className="ml-auto w-20 items-center justify-center"
        onClick={async () => {
          if (!accessToken) {
            return;
          }

          setIsProcessing(true);

          try {
            const client = getInstillAPIClient({
              accessToken,
            });

            const integrationFull =
              await client.mgmt.integration.getIntegration({
                integrationId: integration.id,
                view: "VIEW_FULL",
              });

            queryClient.setQueryData(
              queryKeyStore.integration.getUseGetIntegrationQueryKey({
                integrationId: integration.id,
                view: "VIEW_FULL",
              }),
              integrationFull.integration,
            );

            if (isOAuthAvailable(integrationFull.integration)) {
              if (!namespaceId) {
                setIsProcessing(false);
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
                case "google-drive":
                  provider = "google-drive";
                  break;
                case "google-sheets":
                  provider = "google-sheets";
                  break;
                default:
                  break;
              }

              if (!provider) {
                setIsProcessing(false);
                return;
              }

              setIsProcessing(false);

              initializeIntegrationConnection({
                provider,
                namespaceId,
                integrationId: integration.id,
              });

              return;
            }
          } catch (error) {
            toastInstillError({
              error,
              title: "Failed to connect to integration",
            });
          }

          setIsProcessing(false);
          setEditingDialogIsOpen(true);
        }}
      >
        {isProcessing ? <LoadingSpin className="w-4 h-4" /> : "Connect"}
      </Button>
      <ManualSettingDialog
        isOpen={editingDialogIsOpen}
        onOpenChange={setEditingDialogIsOpen}
        namespaceId={namespaceId}
        integration={integration}
      />
    </div>
  );
};
