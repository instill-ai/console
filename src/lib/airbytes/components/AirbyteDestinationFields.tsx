import { Dispatch, FC, Fragment, SetStateAction } from "react";
import {
  AirbyteFieldErrors,
  AirbyteFieldValues,
  AirbyteFormTree,
  SelectedItemMap,
} from "../types";
import { useBuildAirbyteFields } from "../hooks";
import { Nullable } from "@/types/general";

export type AirbyteDestinationFieldsProps = {
  fieldValues: Nullable<AirbyteFieldValues>;
  setFieldValues: Dispatch<SetStateAction<Nullable<AirbyteFieldValues>>>;
  fieldErrors: Nullable<AirbyteFieldErrors>;
  destinationFormTree: Nullable<AirbyteFormTree>;
  selectedConditionMap: Nullable<SelectedItemMap>;
  setSelectedConditionMap: Dispatch<SetStateAction<Nullable<SelectedItemMap>>>;
  disableAll: boolean;
  formIsDirty: boolean;
  setFormIsDirty: Dispatch<SetStateAction<boolean>>;
};

export const AirbyteDestinationFields: FC<AirbyteDestinationFieldsProps> = ({
  fieldValues,
  setFieldValues,
  fieldErrors,
  destinationFormTree,
  selectedConditionMap,
  setSelectedConditionMap,
  disableAll,
  formIsDirty,
  setFormIsDirty,
}) => {
  const fields = useBuildAirbyteFields(
    destinationFormTree,
    disableAll,
    fieldValues,
    setFieldValues,
    fieldErrors,
    selectedConditionMap,
    setSelectedConditionMap,
    formIsDirty,
    setFormIsDirty
  );

  return <Fragment>{fields}</Fragment>;
};
