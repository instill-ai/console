"use client";

import * as React from "react";
import { AddConnectorDialog } from "./AddConnectorDialog";
import { GeneralAppPageProp, useAppEntity, useUserConnectors } from "../../lib";
import dynamic from "next/dynamic";

const ResourcesTable = dynamic(
  () => import("./ResourcesTable.js").then((mod) => mod.ResourcesTable),
  { ssr: false }
);

export type ResourceListPageMainViewProps = GeneralAppPageProp;

export const ResourceListPageMainView = (
  props: ResourceListPageMainViewProps
) => {
  const { enableQuery, accessToken, router } = props;
  const [addConnectorDialogIsOpen, setAddConnectorDialogIsOpen] =
    React.useState(false);

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const entityObject = useAppEntity();

  const userConnector = useUserConnectors({
    userName: entityObject.data.entityName,
    enabled: enableQuery && entityObject.isSuccess,
    connectorType: "all",
    accessToken,
  });

  // Guard this page
  React.useEffect(() => {
    if (userConnector.isError) {
      router.push("/404");
    }
  }, [userConnector.isError, router]);

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <div className="flex flex-col">
      <div className="mb-8 flex">
        <AddConnectorDialog
          open={addConnectorDialogIsOpen}
          onOpenChange={(open) => setAddConnectorDialogIsOpen(open)}
          accessToken={accessToken}
          onSubmit={() => {
            setAddConnectorDialogIsOpen(false);
          }}
          enableQuery={enableQuery}
          entityName={entityObject.data.entityName}
        />
      </div>
      <ResourcesTable
        connectors={userConnector.isSuccess ? userConnector.data : []}
        isError={userConnector.isError}
        isLoading={userConnector.isLoading}
      />
    </div>
  );
};
