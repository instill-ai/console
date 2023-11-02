import { useEffect } from "react";
import { Pipeline } from "../vdp-sdk";
import { Nullable } from "../type";

export const useSmartHint = (pipeline: Nullable<Pipeline>) => {
  useEffect(() => {
    console.log("placeholder");
  }, [pipeline]);
};
