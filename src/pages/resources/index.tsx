import { FC, ReactElement, useState } from "react";
import {
  PageHead,
  Topbar,
  Sidebar,
  PageBase,
  ResourcesTable,
} from "@/components";
import { Logo } from "@instill-ai/design-system";
import { AddConnectorResourceDialog } from "pipeline-builder/components";
import { useUser, useUserConnectorResources } from "@instill-ai/toolkit";

type GetLayOutProps = {
  page: ReactElement;
};

const PipelinePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const [addConnectorDialogIsOpen, seteAddConnectorDialogIsOpen] =
    useState(false);

  const user = useUser({
    enabled: true,
    accessToken: null,
  });

  const userConnectorResources = useUserConnectorResources({
    userName: user.isSuccess ? user.data.name : null,
    enabled: user.isSuccess,
    accessToken: null,
    connectorResourceType: "all",
  });

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <>
      <PageHead title="pipelines" />
      <div className="flex flex-col">
        <div className="mb-8 flex">
          <AddConnectorResourceDialog
            open={addConnectorDialogIsOpen}
            onOpenChange={(open) => seteAddConnectorDialogIsOpen(open)}
            accessToken={null}
            type="inResource"
            onSelectConnectorResource={() => {
              seteAddConnectorDialogIsOpen(false);
            }}
          />
        </div>
        <ResourcesTable
          connectorResources={
            userConnectorResources.isSuccess ? userConnectorResources.data : []
          }
          isError={userConnectorResources.isError}
          isLoading={userConnectorResources.isLoading}
          accessToken={null}
        />
      </div>
    </>
  );
};

PipelinePage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar logo={<Logo variant="ColourLogomarkWhiteType" width={180} />} />
      <PageBase.Container>
        <Sidebar />
        <PageBase.Content contentPadding="p-8">{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default PipelinePage;
