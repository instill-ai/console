export type User = {
  name: string;
  uid: string;
  email: string;
  id: string;
  first_name: string;
  last_name: string;
  customer_id: string;
  org_name: string;
  role: string;
  newsletter_subscription: boolean;
  type: string;
  create_time: string;
  update_time: string;
  cookie_token?: string;
};

export type ApiToken = {
  name: string;
  uid: string;
  id: string;
  create_time: string;
  update_time: string;
  access_token: string;
  state: ApiTokenState;
  token_type: string;
};

export type ApiTokenState =
  | "STATE_UNSPECIFIED"
  | "STATE_INACTIVE"
  | "STATE_ACTIVE"
  | "STATE_EXPIRED";

export type NamespaceType =
  | "NAMESPACE_UNSPECIFIED"
  | "NAMESPACE_AVAILABLE"
  | "NAMESPACE_USER"
  | "NAMESPACE_ORGANIZATION"
  | "NAMESPACE_RESERVED";
