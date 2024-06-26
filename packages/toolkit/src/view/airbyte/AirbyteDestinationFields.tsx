"use client";

import * as React from "react";

import type { Nullable } from "../../lib";
import { useBuildAirbyteFields } from ".";
import {
  AirbyteFieldErrors,
  AirbyteFieldValues,
  AirbyteFormTree,
  SelectedItemMap,
} from "../../lib/airbytes";

export type AirbyteDestinationFieldsProps = {
  fieldValues: Nullable<AirbyteFieldValues>;
  setFieldValues: React.Dispatch<
    React.SetStateAction<Nullable<AirbyteFieldValues>>
  >;
  fieldErrors: Nullable<AirbyteFieldErrors>;
  destinationFormTree: Nullable<AirbyteFormTree>;
  selectedConditionMap: Nullable<SelectedItemMap>;
  setSelectedConditionMap: React.Dispatch<
    React.SetStateAction<Nullable<SelectedItemMap>>
  >;
  disableAll: boolean;
  formIsDirty: boolean;
  setFormIsDirty: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AirbyteDestinationFields = ({
  fieldValues,
  setFieldValues,
  fieldErrors,
  destinationFormTree,
  selectedConditionMap,
  setSelectedConditionMap,
  disableAll,
  formIsDirty,
  setFormIsDirty,
}: AirbyteDestinationFieldsProps) => {
  const fields = useBuildAirbyteFields(
    destinationFormTree,
    disableAll,
    fieldValues,
    setFieldValues,
    fieldErrors,
    selectedConditionMap,
    setSelectedConditionMap,
    formIsDirty,
    setFormIsDirty,
  );

  return <React.Fragment>{fields}</React.Fragment>;
};
