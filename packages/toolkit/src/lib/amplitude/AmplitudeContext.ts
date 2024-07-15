import * as React from "react";

import { Nullable } from "../type";

type AmplitudeCtxValue = {
  amplitudeIsInit: boolean;
  setAmplitudeIsInit: Nullable<React.Dispatch<React.SetStateAction<boolean>>>;
  userBlockCookieUsage: boolean;
  setUserBlockCookieUsage: Nullable<
    React.Dispatch<React.SetStateAction<boolean>>
  >;
};

const defaultAmplitudeCtxValue: AmplitudeCtxValue = {
  amplitudeIsInit: false,
  setAmplitudeIsInit: null,
  userBlockCookieUsage: false,
  setUserBlockCookieUsage: null,
};

export const AmplitudeCtx = React.createContext(defaultAmplitudeCtxValue);

AmplitudeCtx.displayName = "AmplitudeContext";

export const useAmplitudeCtx = () => React.useContext(AmplitudeCtx);
