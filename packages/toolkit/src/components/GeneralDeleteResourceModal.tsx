import * as React from "react";
import { Button, Dialog, Icons, Input } from "@instill-ai/design-system";
import {
  ConnectorResourceWithDefinition,
  Model,
  Nullable,
  Pipeline,
} from "../lib";
import { IconWithBackground } from "./IconWithBackground";
import { LoadingSpin } from "./LoadingSpin";

export type GenralDeleteResourceModalProps = {
  resource: Nullable<ConnectorResourceWithDefinition | Pipeline | Model>;
  handleDeleteResource: (
    resource: Nullable<ConnectorResourceWithDefinition | Pipeline | Model>
  ) => void;
};

export const GeneralDeleteResourceModal = (
  props: GenralDeleteResourceModalProps
) => {
  const { resource, handleDeleteResource } = props;

  const [isDeleting, setIsDeleting] = React.useState(false);

  const modalDetails = React.useMemo<{
    title: string;
    description: string;
  }>(() => {
    if (!resource) {
      return {
        title: "",
        description: "",
      };
    }

    let title: string;
    let description: string;

    if ("connector_definition" in resource) {
      if (resource.type === "CONNECTOR_TYPE_OPERATOR") {
        title = `Delete ${resource.id} Source`;
        description =
          "This action cannot be undone. This will permanently delete the source.";
      } else if (resource.type === "CONNECTOR_TYPE_DATA") {
        title = `Delete ${resource.id} Destination`;
        description =
          "This action cannot be undone. This will permanently delete the destination.";
      } else if (resource.type === "CONNECTOR_TYPE_AI") {
        title = `Delete ${resource.id} AI`;
        description =
          "This action cannot be undone. This will permanently delete the AI.";
      } else if (resource.type === "CONNECTOR_TYPE_BLOCKCHAIN") {
        title = `Delete ${resource.id} Blockchain`;
        description =
          "This action cannot be undone. This will permanently delete the blockchain.";
      } else {
        title = `Delete ${resource.id} Connector`;
        description =
          "This action cannot be undone. This will permanently delete the connector.";
      }
    } else if ("recipe" in resource) {
      title = `Delete ${resource.id} Pipeline`;
      description =
        "This action cannot be undone. This will permanently delete the pipeline.";
    } else if ("model_definition" in resource) {
      title = `Delete ${resource.id} Model`;
      description =
        "This action cannot be undone. This will permanently delete the model.";
    } else {
      title = "Delete resource";
      description =
        "Something went wrong when try to activate the flow of deleting resource, please contact our support.";
      console.error(
        "You have passed resource not included in Pipeline, Model, Connector, BlockChain and AI"
      );
    }

    return {
      title,
      description,
    };
  }, [resource]);

  // ###################################################################
  // #                                                                 #
  // # Check whether confirmation code is correct                      #
  // #                                                                 #
  // ###################################################################

  const [confirmationCode, setConfirmationCode] =
    React.useState<Nullable<string>>(null);

  React.useEffect(() => {
    setConfirmationCode(null);
  }, []);

  const handleCodeChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setConfirmationCode(event.target.value);
    },
    []
  );

  const canDeleteResource = React.useMemo(() => {
    if (!resource || confirmationCode !== resource.id) return false;
    return true;
  }, [confirmationCode, resource]);

  return (
    <div className="flex flex-col">
      <IconWithBackground
        iconElement={
          <Icons.AlertTriangle className="h-6 w-6 stroke-semantic-warning-on-bg" />
        }
        className={"mx-auto mb-6 flex !h-12 !w-12 bg-semantic-warning-bg !p-3"}
      />
      <div className="mb-6 flex flex-col">
        <h2 className="mb-1 text-center text-semantic-fg-primary product-headings-heading-3">
          {modalDetails.title}
        </h2>
        <p className="mb-6 text-center text-semantic-fg-primary product-body-text-2-regular">
          {modalDetails.description}
        </p>

        <div className="mb-2.5">
          <label htmlFor="confirmationCode">
            Please type
            <span className="mx-1 select-all font-bold">{`${
              resource ? resource.id : ""
            }`}</span>
            to confirm.
          </label>
        </div>

        <Input.Root className="!rounded-none">
          <Input.Core
            id="confirmationCode"
            type="text"
            onChange={handleCodeChange}
            value={confirmationCode || ""}
          />
        </Input.Root>
      </div>
      <div className="flex flex-row gap-x-2">
        <Dialog.Close>
          <Button
            variant="secondaryGrey"
            size="lg"
            className="flex-1 !px-4 !py-3"
          >
            <span className="text-semantic-fg-primary product-button-button-1">
              Cancel
            </span>
          </Button>
        </Dialog.Close>

        <Button
          variant="danger"
          size="lg"
          onClick={() => {
            try {
              setIsDeleting(true);
              handleDeleteResource(resource);
              setIsDeleting(false);
            } catch (error) {
              console.error(error);
              setIsDeleting(false);
            }
          }}
          disabled={canDeleteResource ? false : true}
          className="flex-1 rounded px-4 py-3"
        >
          {isDeleting ? <LoadingSpin /> : "Delete"}
        </Button>
      </div>
    </div>
  );
};
