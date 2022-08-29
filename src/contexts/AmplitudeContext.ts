import { Nullable } from "@/types/general";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

type AmplitudeCtxValue = {
  amplitudeIsInit: boolean;
  setAmplitudeIsInit: Nullable<Dispatch<SetStateAction<boolean>>>;
};

const defaultAmplitudeCtxValue: AmplitudeCtxValue = {
  amplitudeIsInit: false,
  setAmplitudeIsInit: null,
};

export const AmplitudeCtx = createContext(defaultAmplitudeCtxValue);

export const useAmplitudeCtx = () => useContext(AmplitudeCtx);
