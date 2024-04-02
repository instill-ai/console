"use client";

import * as React from "react";
import { AddConnectorDialog } from "./AddConnectorDialog";
import { GeneralPageProp, useEntity, useUserConnectors } from "../../lib";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const ResourcesTable = dynamic(
  () => import("./ResourcesTable.js").then((mod) => mod.ResourcesTable),
  { ssr: false }
);

export type ResourceListPageMainViewProps = GeneralPageProp;

export const ResourceListPageMainView = (
  props: ResourceListPageMainViewProps
) => {
  const router = useRouter();
  const { enableQuery, accessToken } = props;
  const [addConnectorDialogIsOpen, setAddConnectorDialogIsOpen] =
    React.useState(false);

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const entityObject = useEntity();

  const userConnector = useUserConnectors({
    userName: entityObject.entityName,
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
          entityName={entityObject.entityName}
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
