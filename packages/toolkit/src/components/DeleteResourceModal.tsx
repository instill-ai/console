"use client";

import type { Model, Nullable, Pipeline } from "instill-sdk";
import * as React from "react";
import { shallow } from "zustand/shallow";

import {
  BasicTextField,
  ModalRoot,
  OutlineButton,
} from "@instill-ai/design-system";

import type { ModalStore } from "../lib";
import { useModalStore } from "../lib";

export type DeleteResourceModalProps = {
  resource: Nullable<Pipeline | Model>;
  handleDeleteResource: () => void;
};

const selector = (state: ModalStore) => ({
  open: state.modalIsOpen,
  closeModal: state.closeModal,
});

export const DeleteResourceModal = ({
  resource,
  handleDeleteResource,
}: DeleteResourceModalProps) => {
  const { closeModal, open } = useModalStore(selector, shallow);

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

    if ("recipe" in resource) {
      title = "Delete This Pipeline";
      description =
        "This action cannot be undone. This will permanently delete the pipeline.";
    } else if ("modelDefinition" in resource) {
      title = "Delete This Model";
      description =
        "This action cannot be undone. This will permanently delete the model.";
    } else {
      title = "Delete resource";
      description =
        "Something went wrong when try to activate the flow of deleting resource, please contact our support.";
      console.error(
        "You have passed resource not included in Pipeline, Model, Component, Application and AI",
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
  }, [open]);

  const handleCodeChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setConfirmationCode(event.target.value);
    },
    [],
  );

  const canDeleteResource = React.useMemo(() => {
    if (!resource || confirmationCode !== resource.id) return false;
    return true;
  }, [confirmationCode, resource]);

  return (
    <ModalRoot
      open={open}
      modalBgColor="bg-white"
      modalPadding="p-5"
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
            onClickHandler={() => closeModal()}
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
    </ModalRoot>
  );
};
