import { GeneralRecord, Nullable } from "../../type";

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
