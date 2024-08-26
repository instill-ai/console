import { expect, test } from "vitest";

import { InstillAPIClient } from "../../main";
import { getRemainingInstillCreditResponseValidator } from "./types";

// We have issue in our protobuf
test.skip("getRemainingInstillCredit", async () => {
  const client = new InstillAPIClient({
    baseURL: `http://localhost:8080/${process.env.INSTILL_API_VERSION}`,
    apiToken: "test",
    debug: true,
  });

  const credit = await client.core.credit.getRemainingInstillCredit({
    ownerName: "users/uid",
  });

  const parsedData =
    getRemainingInstillCreditResponseValidator.safeParse(credit);

  expect(parsedData.success).toBe(true);
});
