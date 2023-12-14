import * as React from "react";
import { PageTitle } from "../../components";
import { GeneralPageProp, useEntity, useUserConnector } from "../../lib";
import { AIResourceAutoForm } from "../ai";
import { BlockchainResourceAutoForm } from "../blockchain";
import { DataResourceForm } from "../data";

export type ResourceSettingPageMainViewProps = GeneralPageProp;

export const ResourceSettingPageMainView = (
  props: ResourceSettingPageMainViewProps
) => {
  const { accessToken, enableQuery, router } = props;
  const { id, entity } = router.query;

  const entirtyObject = useEntity();

  const userConnector = useUserConnector({
    connectorName: entirtyObject.connectorName,
    enabled: enableQuery && entirtyObject.isSuccess,
    accessToken: accessToken,
  });

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <div className="flex flex-col">
      <PageTitle
        title={`${id?.toString()}`}
        breadcrumbs={["Connectors", "Connector Settings"]}
        className="mb-5"
      />
      {userConnector.isSuccess ? (
        <React.Fragment>
          {userConnector.data.type === "CONNECTOR_TYPE_AI" ? (
            <AIResourceAutoForm
              definition={userConnector.data.connector_definition}
              resource={userConnector.data}
              accessToken={accessToken}
            />
          ) : null}
          {userConnector.data.type === "CONNECTOR_TYPE_BLOCKCHAIN" ? (
            <BlockchainResourceAutoForm
              definition={userConnector.data.connector_definition}
              resource={userConnector.data}
              accessToken={accessToken}
            />
          ) : null}
          {userConnector.data.type === "CONNECTOR_TYPE_DATA" ? (
            <DataResourceForm
              dataDefinition={userConnector.data.connector_definition}
              dataResource={userConnector.data}
              accessToken={accessToken}
              enableBackButton={false}
              enableQuery={enableQuery}
            />
          ) : null}
        </React.Fragment>
      ) : (
        <div className="flex h-[300px] w-full items-center justify-center rounded-md border border-semantic-bg-line text-semantic-fg-primary product-body-text-3-semibold">
          loading...
        </div>
      )}
    </div>
  );
};
