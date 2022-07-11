import { BasicTextField } from "@instill-ai/design-system";
import {
  Dispatch,
  FC,
  memo,
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
import ModalBase from "../ModalBase";
import { Nullable } from "@/types/general";
import OutlineButton from "@/components/ui/Buttons/OutlineButton";

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

const DeleteResourceModal: FC<DeleteResourceModalProps> = ({
  modalIsOpen,
  setModalIsOpen,
  resource,
  handleDeleteResource,
}) => {
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

  const handleCodeChange = useCallback((_, input: string) => {
    setConfirmationCode(input);
  }, []);

  const canDeleteResource = useMemo(() => {
    if (!resource || confirmationCode !== resource.id) return false;
    return true;
  }, [confirmationCode, resource]);

  return (
    <ModalBase
      modalBgColor="bg-white"
      modalPadding="p-5"
      modalIsOpen={modalIsOpen}
    >
      <div className="flex flex-col gap-y-5">
        <h2 className="text-instill-h2">{modalDetails.title}</h2>
        <p>{modalDetails.description}</p>
        <BasicTextField
          id="confirmationCode"
          type="text"
          label={`Please type "${resource ? resource.id : ""}" to confirm.`}
          additionalMessageOnLabel={null}
          onChangeInput={handleCodeChange}
          value={confirmationCode}
          autoComplete="off"
          placeholder={""}
          error={null}
          disabled={false}
          readOnly={false}
          required={false}
          description=""
        />
        <div className="grid grid-cols-2 gap-x-5">
          <OutlineButton
            type="button"
            disabled={false}
            disabledBgColor="bg-instillGrey15"
            bgColor="bg-white"
            hoveredBgColor="hover:bg-instillGrey50"
            disabledTextColor="text-instillGrey50"
            textColor="text-instillGrey50"
            hoveredTextColor="hover:text-instillGrey05"
            width="w-full"
            borderSize="border"
            borderColor="border-instillGrey50"
            hoveredBorderColor={null}
            disabledBorderColor={null}
            onClickHandler={() => setModalIsOpen(false)}
            position={null}
          >
            Cancel
          </OutlineButton>
          <OutlineButton
            type="button"
            disabled={canDeleteResource ? false : true}
            disabledBgColor="bg-instillGrey15"
            bgColor="bg-white"
            hoveredBgColor="hover:bg-instillRed"
            disabledTextColor="text-instillGrey30"
            textColor={
              canDeleteResource ? "text-instillRed" : "text-instillGrey50"
            }
            hoveredTextColor="hover:text-instillRed10"
            width="w-full"
            borderSize={canDeleteResource ? "border" : null}
            borderColor="border-instillRed"
            hoveredBorderColor={null}
            disabledBorderColor={null}
            onClickHandler={handleDeleteResource}
            position={null}
          >
            Delete
          </OutlineButton>
        </div>
      </div>
    </ModalBase>
  );
};

export default memo(DeleteResourceModal);
