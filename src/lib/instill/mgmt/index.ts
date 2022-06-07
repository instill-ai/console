import type { User } from "./types";

import type { UpdateUserResponse } from "./mutations";
import { updateLocalUserMutation } from "./mutations";

import type { GetUserResponse } from "./queries";
import { getUserQuery } from "./queries";

import { mockMgmtRoles } from "./mocks";

export type { User, UpdateUserResponse, GetUserResponse };

export { mockMgmtRoles, getUserQuery, updateLocalUserMutation };
