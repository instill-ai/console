"use client";

import * as React from "react";
import { PageTitle } from "../../components";
import {
  GeneralPageProp,
  Nullable,
  useEntity,
  useUserConnector,
} from "../../lib";
import { AIResourceAutoForm } from "../ai";
import { ApplicationResourceAutoForm } from "../application";
import { AirbyteDataResourceForm, DataResourceAutoForm } from "../data";
import { NextRouter } from "next/router";

export type ResourceSettingPageMainViewProps = {
  router: NextRouter;
  enableQuery: boolean;
  accessToken: Nullable<string>;
};

export const ResourceSettingPageMainView = (
  props: ResourceSettingPageMainViewProps
) => {
  const { accessToken, enableQuery, router } = props;
  const { id } = router.query;

  const entirtyObject = useEntity();

  const userConnector = useUserConnector({
    connectorName: entirtyObject.connectorName,
    enabled: enableQuery && entirtyObject.isSuccess,
    accessToken: accessToken,
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
              entityName={entirtyObject.entityName}
            />
          ) : null}
          {userConnector.data.type === "CONNECTOR_TYPE_APPLICATION" ? (
            <ApplicationResourceAutoForm
              definition={userConnector.data.connector_definition}
              resource={userConnector.data}
              accessToken={accessToken}
              entityName={entirtyObject.entityName}
            />
          ) : null}
          {userConnector.data.type === "CONNECTOR_TYPE_DATA" ? (
            userConnector.data.connector_definition.id ===
            "airbyte-destination" ? (
              <AirbyteDataResourceForm
                dataDefinition={userConnector.data.connector_definition}
                dataResource={userConnector.data}
                accessToken={accessToken}
                enableBackButton={false}
                enableQuery={enableQuery}
                entityName={entirtyObject.entityName}
              />
            ) : (
              <DataResourceAutoForm
                definition={userConnector.data.connector_definition}
                resource={userConnector.data}
                accessToken={accessToken}
                entityName={entirtyObject.entityName}
              />
            )
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
