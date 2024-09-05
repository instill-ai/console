import { test } from "@playwright/test";

import { skeletonTest } from "./tests/skeleton";

test.describe(skeletonTest);

// import { shouldChangeComponentID } from "./tests/should-change-component-id.test";
// import { shouldEditAndCreateStartAndEndOperatorField } from "./tests/should-edit-create-start-end-field.test";
// import { shouldUnmarshalJSONInput } from "./tests/should-unmarshal.test";

// We don't have the no-code builder anymore
// test.describe(shouldChangeComponentID);
// test.describe(shouldUnmarshalJSONInput);
// test.describe(shouldEditAndCreateStartAndEndOperatorField);
