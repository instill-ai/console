import { test } from "@playwright/test";

import { shouldChangeComponentID } from "./tests/should-change-component-id.test";
import { shouldEditAndCreateStartAndEndOperatorField } from "./tests/should-edit-create-start-end-field.test";
import { shouldUnmarshalJSONInput } from "./tests/should-unmarshal.test";

test.describe(shouldChangeComponentID);
test.describe(shouldUnmarshalJSONInput);
test.describe(shouldEditAndCreateStartAndEndOperatorField);
