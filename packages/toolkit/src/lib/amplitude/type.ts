export type AmplitudeEvent =
  // Critical event
  | "create_pipeline"
  | "delete_pipeline"
  | "update_pipeline_recipe"
  | "update_pipeline_name"
  | "update_pipeline_description"
  | "update_pipeline_readme"
  | "update_model_readme"
  | "publish_pipeline"
  | "unpublish_pipeline"
  | "enable_pipeline_share_by_link"
  | "disable_pipeline_share_by_link"
  | "clone_pipeline"
  | "duplicate_pipeline"
  | "trigger_pipeline"
  | "search_pipelines"
  | "create_connector"
  | "delete_connector"
  | "update_connector"
  | "submit_onboarding_form"
  | "create_api_token"
  | "delete_api_token"
  | "create_organization"
  | "invite_user_to_organization"
  | "remove_user_from_organization"
  | "update_user_profile_settings"
  | "update_organization_profile_settings"
  | "update_model"
  | "delete_model"
  | "create_model"
  | "trigger_model"
  | "enter_subscription_pro_flow"
  | "subscribe_to_pro"
  | "enter_subscription_team_flow"
  | "subscribe_to_team"
  | "create_secret"
  | "delete_secret";

export type AmplitudeEventProperties = {
  connector_definition_name?: string;
  model_definition_name?: string;
};
