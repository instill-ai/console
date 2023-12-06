import { GeneralRecord, Nullable } from "../../type";
import { User } from "../mgmt";

export type Organization = {
  name: string;
  uid: string;
  id: string;
  create_time: string;
  update_time: string;
  org_name: string;
  customer_id: string;
  profile_avatar: Nullable<string>;
  profile_data: Nullable<GeneralRecord>;
};
export type Membership = {
  user: User;
  organization: Organization;
  name: Nullable<string>;
  role: ROLE;
  state: MEMBERSHIP_STATE;
};

export type ROLE = "admin" | "member";

export type MEMBERSHIP_STATE =
  | "MEMBERSHIP_STATE_ACTIVE"
  | "MEMBERSHIP_STATE_PENDING";
