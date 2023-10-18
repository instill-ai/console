import * as React from "react";
import { useAmplitudeCtx } from "./AmplitudeContext";
import { sendAmplitudeData } from "./helper";
import { AmplitudeEvent, AmplitudeEventProperties } from "./type";

export const useSendAmplitudeData = (
  event: AmplitudeEvent,
  properties: AmplitudeEventProperties,
  routerIsReady: boolean
) => {
  const { amplitudeIsInit } = useAmplitudeCtx();
  React.useEffect(() => {
    if (!amplitudeIsInit || !routerIsReady) return;

    sendAmplitudeData(event, properties);
  }, [routerIsReady, amplitudeIsInit, event, properties]);
};
