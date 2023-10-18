export type AmplitudeEventProperties = {
  type: "navigation" | "critical_action";
  process?:
    | "source"
    | "destination"
    | "pipeline"
    | "model"
    | "ai"
    | "blockchain";
};

export type AmplitudeEvent =
  // Critical event
  | "create_local_model"
  | "create_github_model"
  | "create_artivc_model"
  | "delete_model"
  | "update_model"
  | "deploy_model_instance"
  | "update_model_instance"
  | "use_existing_model_instance"
  | "test_model_instance"
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
  | "create_ai"
  | "delete_ai"
  | "update_ai"
  | "create_blockchain"
  | "delete_blockchain"
  | "update_blockchain"
  | "use_existing_source"
  | "go_to_stripe_portal"
  | "go_to_stripe_checkout"
  | "submit_onboarding_form"
  | "change_user_info"
  | "create_api_token"
  | "delete_api_token";
