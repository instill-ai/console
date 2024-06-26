import * as React from "react";

import { Nullable } from "../type";

type AmplitudeCtxValue = {
  amplitudeIsInit: boolean;
  setAmplitudeIsInit: Nullable<React.Dispatch<React.SetStateAction<boolean>>>;
};

const defaultAmplitudeCtxValue: AmplitudeCtxValue = {
  amplitudeIsInit: false,
  setAmplitudeIsInit: null,
};

export const AmplitudeCtx = React.createContext(defaultAmplitudeCtxValue);

AmplitudeCtx.displayName = "AmplitudeContext";

export const useAmplitudeCtx = () => React.useContext(AmplitudeCtx);
