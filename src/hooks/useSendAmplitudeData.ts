import { useEffect } from "react";
import {
  AmplitudeEvent,
  AmplitudeEventProperties,
  sendAmplitudeData,
} from "@/lib/amplitude";

export const useSendAmplitudeData = (
  event: AmplitudeEvent,
  properties: AmplitudeEventProperties,
  routerIsReady: boolean,
  amplitudeIsReady: boolean
) => {
  useEffect(() => {
    if (!amplitudeIsReady || !routerIsReady) return;

    sendAmplitudeData(event, properties);
  }, [routerIsReady, amplitudeIsReady, event, properties]);
};
