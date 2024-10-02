"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { IntegrationConnection, Nullable } from "instill-sdk";

import { cn, Icons, Tag } from "@instill-ai/design-system";

import { CopiedTooltip } from "../../../../components";
import {
  OAuthCallbackConnectionIdQueryParam,
  OAuthCallbackIntegrationIdQueryParam,
  OAuthCallbackStatusQueryParam,
} from "../../../../constant";
import { formatDate } from "../../../../lib";
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
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-row gap-x-2 items-center">
          <span className="text-semantic-fg-primary font-semibold text-sm">
            {connection.id}
          </span>

          <CopiedTooltip isOpen={copied}>
            <Icons.Copy06
              className="w-4 h-4 stroke-semantic-fg-secondary cursor-pointer"
              onClick={async () => {
                await navigator.clipboard.writeText(
                  `\${connection.${connection.id}}`,
                );
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 1000);
              }}
            />
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
          {/* <Button
          variant="secondaryGrey"
          className="ml-auto"
          size="sm"
          onClick={onTest}
        >
          Test
        </Button> */}
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
      <div className="flex flex-col gap-1">
        <div className="flex flex-row">
          <div className="w-32 text-semantic-fg-disabled text-sm font-normal">
            Date connected:
          </div>
          <div className="text-semantic-fg-primary text-sm font-normal">
            {formatDate(connection.createTime)}
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
