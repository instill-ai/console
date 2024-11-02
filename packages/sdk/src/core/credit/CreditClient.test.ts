import { expect, test } from "vitest";

import { InstillAPIClient } from "../../main";
import { getNamespaceRemainingInstillCreditResponseValidator } from "./types";

test("getNamespaceRemainingInstillCredit", async () => {
  const client = new InstillAPIClient({
    baseURL: `http://localhost:8080/${process.env.INSTILL_API_VERSION}`,
    apiToken: "test",
    debug: true,
  });

  const credit = await client.core.credit.getNamespaceRemainingInstillCredit({
    namespaceId: "uid",
  });

  const parsedData =
    getNamespaceRemainingInstillCreditResponseValidator.safeParse(credit);

  expect(parsedData.success).toBe(true);
});
