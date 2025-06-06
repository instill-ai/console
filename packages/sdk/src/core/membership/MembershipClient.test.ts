import { expect, test } from "vitest";

import { InstillAPIClient } from "../../main";
import {
  getUserMembershipResponseValidator,
  listOrganizationMembershipsResponseValidator,
  listUserMembershipsResponseValidator,
} from "./types";

test("listUserMemberships", async () => {
  const client = new InstillAPIClient({
    baseURL: `http://localhost:8080/${process.env.INSTILL_API_VERSION}`,
    apiToken: "test",
    debug: true,
  });

  const memberships = await client.core.membership.listUserMemberships({
    userId: "uid",
  });

  const parsedData =
    listUserMembershipsResponseValidator.safeParse(memberships);

  expect(parsedData.success).toBe(true);
});

test("getUserMembership", async () => {
  const client = new InstillAPIClient({
    baseURL: `http://localhost:8080/${process.env.INSTILL_API_VERSION}`,
    apiToken: "test",
    debug: true,
  });

  const membership = await client.core.membership.getUserMembership({
    userId: "uid",
    organizationId: "oid",
    view: "VIEW_FULL",
  });

  const parsedData = getUserMembershipResponseValidator.safeParse(membership);

  expect(parsedData.success).toBe(true);
});

test("listOrganizationMemberships", async () => {
  const client = new InstillAPIClient({
    baseURL: `http://localhost:8080/${process.env.INSTILL_API_VERSION}`,
    apiToken: "test",
    debug: true,
  });

  const memberships = await client.core.membership.listOrganizationMemberships({
    organizationId: "oid",
  });

  const parsedData =
    listOrganizationMembershipsResponseValidator.safeParse(memberships);

  expect(parsedData.success).toBe(true);
});

test("getOrganizationMembership", async () => {
  const client = new InstillAPIClient({
    baseURL: `http://localhost:8080/${process.env.INSTILL_API_VERSION}`,
    apiToken: "test",
    debug: true,
  });

  const membership = await client.core.membership.getOrganizationMembership({
    userId: "mid",
    organizationId: "oid",
    view: "FULL",
  });

  const parsedData = getUserMembershipResponseValidator.safeParse(membership);

  expect(parsedData.success).toBe(true);
});
