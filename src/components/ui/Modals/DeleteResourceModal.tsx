import { BasicTextField, OutlineButton } from "@instill-ai/design-system";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  DestinationWithDefinition,
  Model,
  ModelInstance,
  Pipeline,
  SourceWithDefinition,
} from "@/lib/instill";
import { ModalBase } from "./ModalBase";
import { Nullable } from "@/types/general";

export type DeleteResourceModalProps = {
  resource: Nullable<
    | SourceWithDefinition
    | DestinationWithDefinition
    | Pipeline
    | Model
    | ModelInstance
  >;
  modalIsOpen: boolean;
  setModalIsOpen: Dispatch<SetStateAction<boolean>>;
  handleDeleteResource: () => void;
};

export const DeleteResourceModal = ({
  modalIsOpen,
  setModalIsOpen,
  resource,
  handleDeleteResource,
}: DeleteResourceModalProps) => {
  // ###################################################################
  // #                                                                 #
  // # Initialize the function of modal                                #
  // #                                                                 #
  // ###################################################################

  const modalDetails = useMemo<{ title: string; description: string }>(() => {
    if (!resource) {
      return {
        title: "",
        description: "",
      };
    }

    const resourcePrefix = resource.name.split("/")[0];
    let title: string;
    let description: string;

    switch (resourcePrefix) {
      case "pipelines": {
        title = "Delete This Pipeline";
        description =
          "This action cannot be undone. This will permanently delete the pipeline.";
        break;
      }

      case "source-connectors": {
        title = "Delete This Source";
        description =
          "This action cannot be undone. This will permanently delete the source.";
        break;
      }

      case "destination-connectors": {
        title = "Delete This Destination";
        description =
          "This action cannot be undone. This will permanently delete the destination.";
        break;
      }

      case "models": {
        if (resource.name.split("/")[2]) {
          title = "Delete This Model Instance";
          description =
            "This action cannot be undone. This will permanently delete the model instance.";
          break;
        } else {
          title = "Delete This Model";
          description =
            "This action cannot be undone. This will permanently delete the model.";
          break;
        }
      }

      default: {
        title = "Delete resource";
        description =
          "Something went wrong when try to activate the flow of deleting resource, please contact our support.";
        console.error(
          "You have passed resource not included in Pipeline, Model and Connector"
        );
      }
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
    useState<Nullable<string>>(null);

  const handleCodeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setConfirmationCode(event.target.value);
    },
    []
  );

  const canDeleteResource = useMemo(() => {
    if (!resource || confirmationCode !== resource.id) return false;
    return true;
  }, [confirmationCode, resource]);

  return (
    <ModalBase
      modalBgColor="bg-white"
      modalPadding="p-5"
      modalIsOpen={modalIsOpen}
      dataTestId="delete-resource-modal"
    >
      <div className="flex flex-col gap-y-5">
        <h2 className="text-instill-h2">{modalDetails.title}</h2>
        <p>{modalDetails.description}</p>
        <BasicTextField
          id="confirmationCode"
          type="text"
          label={`Please type "${resource ? resource.id : ""}" to confirm.`}
          onChange={handleCodeChange}
          value={confirmationCode}
        />
        <div className="grid grid-cols-2 gap-x-5">
          <OutlineButton
            type="button"
            disabled={false}
            onClickHandler={() => setModalIsOpen(false)}
            color="secondary"
            hoveredShadow={null}
          >
            <p className="mx-auto">Cancel</p>
          </OutlineButton>
          <OutlineButton
            type="button"
            onClickHandler={handleDeleteResource}
            color="danger"
            disabled={canDeleteResource ? false : true}
            hoveredShadow={null}
          >
            <p className="mx-auto">Delete</p>
          </OutlineButton>
        </div>
      </div>
    </ModalBase>
  );
};
