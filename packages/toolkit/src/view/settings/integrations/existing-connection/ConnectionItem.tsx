"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { IntegrationConnection, Nullable } from "instill-sdk";

import { Button, cn, Icons, Tag } from "@instill-ai/design-system";

import { CopiedTooltip } from "../../../../components";
import {
  OAuthCallbackConnectionIdQueryParam,
  OAuthCallbackIntegrationIdQueryParam,
  OAuthCallbackStatusQueryParam,
} from "../../../../constant";
import { formatDateFull } from "../../../../lib";
import { ConnectionPipelineList } from "./ConnectionPipelineList";

export const ConnectionItem = ({
  connection,
  setEditingConnection,
  setDeleteConnection,
  namespaceId,
}: {
  connection: IntegrationConnection;
  setEditingConnection: (connection: Nullable<IntegrationConnection>) => void;
  setDeleteConnection: (connection: Nullable<IntegrationConnection>) => void;
  namespaceId: Nullable<string>;
}) => {
  const [copied, setCopied] = React.useState(false);
  const [justConnected, setJustConnected] = React.useState(false);
  const searchParams = useSearchParams();
  const oAuthCallbackConnectionId = searchParams.get(
    OAuthCallbackConnectionIdQueryParam,
  );
  const oAuthCallbackIntegrationId = searchParams.get(
    OAuthCallbackIntegrationIdQueryParam,
  );
  const oAuthCallbackStatus = searchParams.get(OAuthCallbackStatusQueryParam);

  React.useEffect(() => {
    if (
      oAuthCallbackConnectionId === connection.id &&
      oAuthCallbackIntegrationId === connection.integrationId &&
      oAuthCallbackStatus === "success"
    ) {
      setJustConnected(true);
      setTimeout(() => {
        setJustConnected(false);
      }, 3000);
    }
  }, [
    oAuthCallbackConnectionId,
    oAuthCallbackIntegrationId,
    oAuthCallbackStatus,
    connection.id,
    connection.integrationId,
  ]);

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex flex-col gap-y-1">
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-row gap-x-2 items-center">
            <span className="text-semantic-fg-primary font-semibold text-sm">
              {connection.id}
            </span>

            <CopiedTooltip isOpen={copied}>
              <Button
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    `\${connection.${connection.id}}`,
                  );
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 1000);
                }}
                variant="tertiaryGrey"
                size="sm"
              >
                <Icons.Copy06 className="w-3 h-3 stroke-semantic-fg-secondary cursor-pointer" />
              </Button>
            </CopiedTooltip>
            <Tag
              className={cn(
                "transition-opacity duration-300",
                justConnected ? "opacity-100" : "opacity-0",
              )}
              variant="lightGreen"
            >
              Connected
            </Tag>
          </div>
          <div className="flex flex-row gap-x-2 items-center">
            <Icons.Edit05
              className="w-4 h-4 stroke-semantic-fg-secondary cursor-pointer"
              onClick={() => setEditingConnection(connection)}
            />
            <Icons.Trash01
              className="w-4 h-4 stroke-semantic-fg-secondary cursor-pointer"
              onClick={() => setDeleteConnection(connection)}
            />
          </div>
        </div>
        {connection.method === "METHOD_OAUTH" && connection.identity ? (
          <p className="product-body-text-4-regular text-semantic-fg-secondary">
            {connection.identity as string}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-y-1">
        <div className="flex flex-row">
          <div className="w-32 text-semantic-fg-disabled text-sm font-normal">
            Date connected:
          </div>
          <div className="text-semantic-fg-primary text-sm font-normal">
            {formatDateFull(connection.createTime)}
          </div>
        </div>
        <ConnectionPipelineList
          namespaceId={namespaceId}
          connectionId={connection.id}
        />
      </div>
    </div>
  );
};
