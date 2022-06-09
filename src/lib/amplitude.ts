import { Nullable } from "@/types/general";
import { init, setUserId, track } from "@amplitude/analytics-browser";

export type AmplitudeEventProperties = {
  type: "navigation" | "critical_action";
  process?: "source" | "destination" | "pipeline" | "model";
};

export type AmplitudeEvent =
  // Navigtion
  | "hit_pipelines_page"
  | "hit_pipeline_page"
  | "hit_create_pipeline_page"
  | "hit_models_page"
  | "hit_model_page"
  | "hit_create_model_page"
  | "hit_sources_page"
  | "hit_source_page"
  | "hit_create_source_page"
  | "hit_destinations_page"
  | "hit_destination_page"
  | "hit_create_destination_page"
  | "hit_onboarding_page"

  // Critical event
  | "create_local_model"
  | "create_github_model"
  | "delete_model"
  | "update_model"
  | "deploy_model_instance"
  | "update_model_instance"
  | "use_existing_model_instance"
  | "create_pipeline"
  | "delete_pipeline"
  | "update_pipeline"
  | "create_destination"
  | "delete_destination"
  | "use_existing_destination"
  | "update_destination"
  | "create_source"
  | "delete_source"
  | "update_source"
  | "use_existing_source";

export const initAmplitude = (userId: Nullable<string>) => {
  if (process.env.NEXT_PUBLIC_AMPLITUDE_KEY) {
    init(process.env.NEXT_PUBLIC_AMPLITUDE_KEY, userId ? userId : undefined);
  }
};

export const setAmplitudeUserId = (userId: string) => {
  setUserId(userId);
};

export const sendAmplitudeData = (
  eventType: AmplitudeEvent,
  eventProperties: AmplitudeEventProperties
) => {
  track(eventType, eventProperties);
};
