import { expect, test } from "vitest";

import { InstillAPIClient } from "../../main";
import {
  getAuthenticatedResponseValidator,
  getUserResponseValidator,
  listUsersWithPaginationResponseValidator,
  updateAuthenticatedUserResponseValidator,
} from "./types";

test("getAuthenticatedUser", async () => {
  const client = new InstillAPIClient({
    baseURL: `http://localhost:8080/${process.env.INSTILL_API_VERSION}`,
    apiToken: "test",
    debug: true,
  });

  const user = await client.mgmt.user.getAuthenticatedUser();

  const parsedData = getAuthenticatedResponseValidator.safeParse(user);

  expect(parsedData.success).toBe(true);
});

test("updateAuthenticatedUser", async () => {
  const client = new InstillAPIClient({
    baseURL: `http://localhost:8080/${process.env.INSTILL_API_VERSION}`,
    apiToken: "test",
    debug: true,
  });

  const user = await client.mgmt.user.updateAuthenticatedUser({
    name: "users/uid",
    email: "foo",
  });

  const parsedData = updateAuthenticatedUserResponseValidator.safeParse(user);

  expect(parsedData.success).toBe(true);
});

test("getUser", async () => {
  const client = new InstillAPIClient({
    baseURL: `http://localhost:8080/${process.env.INSTILL_API_VERSION}`,
    apiToken: "test",
    debug: true,
  });

  const user = await client.mgmt.user.getUser({
    userId: "userid",
    view: "VIEW_FULL",
  });

  const parsedData = getUserResponseValidator.safeParse(user);

  expect(parsedData.success).toBe(true);
});

test("listUsers", async () => {
  const client = new InstillAPIClient({
    baseURL: `http://localhost:8080/${process.env.INSTILL_API_VERSION}`,
    apiToken: "test",
    debug: true,
  });

  const users = await client.mgmt.user.listUsers({
    enablePagination: true,
    view: "VIEW_FULL",
    filter: "filter",
    pageSize: 10,
    pageToken: "pt",
  });

  const parsedData = listUsersWithPaginationResponseValidator.safeParse(users);

  expect(parsedData.success).toBe(true);
});
