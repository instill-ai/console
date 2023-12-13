import * as React from "react";
import { AddConnectorDialog } from "./AddConnectorDialog";
import { GeneralPageProp, useEntity, useUserConnectors } from "../../lib";
import dynamic from "next/dynamic";

const ResourcesTable = dynamic(
  () => import("./ResourcesTable").then((mod) => mod.ResourcesTable),
  { ssr: false }
);

export type ResourceListPageMainViewProps = GeneralPageProp;

export const ResourceListPageMainView = (
  props: ResourceListPageMainViewProps
) => {
  const { enableQuery, accessToken, router } = props;
  const { entity } = router.query;
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
        />
      </div>
      <ResourcesTable
        connectors={userConnector.isSuccess ? userConnector.data : []}
        isError={userConnector.isError}
        isLoading={userConnector.isLoading}
        accessToken={accessToken}
      />
    </div>
  );
};
