import { test } from "@playwright/test";
import { shouldChangeComponentID } from "./tests/should-change-component-id.test";
import { shouldUnmarshalJSONInput } from "./tests/should-unmarshal.test";
import { shouldEditAndCreateStartAndEndOperatorField } from "./tests/should-edit-create-start-end-field.test";

test.describe(shouldChangeComponentID);
test.describe(shouldUnmarshalJSONInput);
test.describe(shouldEditAndCreateStartAndEndOperatorField);
