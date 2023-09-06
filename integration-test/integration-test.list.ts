import { test } from "@playwright/test";

import { handleArtivcModelTest } from "./model-artivc.spec";
import { handleGeneralModelTest } from "./model-general.spec";
import { handleGithubModelTest } from "./model-github.spec";
import { handleHuggingFaceModelTest } from "./model-huggingface.spec";
import { handleLocalModelTest } from "./model-local.spec";
import { handleOnboardingTest } from "./onboarding.spec";

test.describe(handleOnboardingTest);
test.describe(handleGeneralModelTest);
test.describe(handleArtivcModelTest);
test.describe(handleGithubModelTest);
test.describe(handleHuggingFaceModelTest);
test.describe(handleLocalModelTest);

// We need to add back tests for pipeline builder
