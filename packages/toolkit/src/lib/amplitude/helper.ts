import { Nullable } from "../type";
import { init, setUserId, track } from "@amplitude/analytics-browser";
import { env } from "../../server";
import { AmplitudeEvent, AmplitudeEventProperties } from "./type";

export const initAmplitude = (
  userId: Nullable<string>,
  enabledPageViewsTracking = true,
  enabledSessionTracking = true
) => {
  if (!env("NEXT_PUBLIC_AMPLITUDE_KEY")) {
    console.error("Amplitude key is not set");
    return;
  }

  init(env("NEXT_PUBLIC_AMPLITUDE_KEY"), userId ? userId : undefined, {
    defaultTracking: {
      pageViews: enabledPageViewsTracking,
      sessions: enabledSessionTracking,
    },
  });
};

export const setAmplitudeUserId = (userId: string) => {
  setUserId(userId);
};

export const sendAmplitudeData = (
  eventType: AmplitudeEvent,
  eventProperties?: AmplitudeEventProperties
) => {
  track(eventType, {
    ...eventProperties,
    edition: env("NEXT_PUBLIC_CONSOLE_EDITION"),
  });
};
