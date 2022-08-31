import { Dispatch, FC, Fragment, SetStateAction } from "react";
import {
  AirbyteFieldErrors,
  AirbyteFieldValues,
  AirbyteFormTree,
  SelectedItemMap,
} from "../../types";
import useBuildAirbyteFields from "../../hooks/useBuildAirbyteFields";
import { Nullable } from "@/types/general";

export type AirbyteDestinationFieldsProps = {
  fieldValues: Nullable<AirbyteFieldValues>;
  setFieldValues: Dispatch<SetStateAction<Nullable<AirbyteFieldValues>>>;
  fieldErrors: Nullable<AirbyteFieldErrors>;
  destinationFormTree: Nullable<AirbyteFormTree>;
  selectedConditionMap: Nullable<SelectedItemMap>;
  setSelectedConditionMap: Dispatch<SetStateAction<Nullable<SelectedItemMap>>>;
  disableAll: boolean;
};

const AirbyteDestinationFields: FC<AirbyteDestinationFieldsProps> = ({
  fieldValues,
  setFieldValues,
  fieldErrors,
  destinationFormTree,
  selectedConditionMap,
  setSelectedConditionMap,
  disableAll,
}) => {
  const fields = useBuildAirbyteFields(
    destinationFormTree,
    disableAll,
    fieldValues,
    setFieldValues,
    fieldErrors,
    selectedConditionMap,
    setSelectedConditionMap
  );

  return <Fragment>{fields}</Fragment>;
};

export default AirbyteDestinationFields;
