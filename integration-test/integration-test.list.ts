import { test } from "@playwright/test";
import { handleAsyncDestinationTest } from "./destination-async.spec";
import { handleSyncDestinationTest } from "./destination-sync.spec";
import { handleArtivcModelTest } from "./model-artivc.spec";
import { handleGeneralModelTest } from "./model-general.spec";
import { handleGithubModelTest } from "./model-github.spec";
import { handleHuggingFaceModelTest } from "./model-huggingface.spec";
import { handleLocalModelTest } from "./model-local.spec";
import { handleOnboardingTest } from "./onboarding.spec";
import { handleAsyncPipelineTest } from "./pipeline-async.spec";
import { handleSyncPipelineTest } from "./pipeline-sync.spec";
import { handleSourceTest } from "./source.spec";

// test.describe(handleOnboardingTest);
// test.describe(handleSourceTest);
// test.describe(handleSyncDestinationTest);
// test.describe(handleAsyncDestinationTest);
test.describe(handleGeneralModelTest);
// test.describe(handleArtivcModelTest);
// test.describe(handleGithubModelTest);
// test.describe(handleHuggingFaceModelTest);
// test.describe(handleLocalModelTest);
// test.describe(handleSyncPipelineTest);
// test.describe(handleAsyncPipelineTest);
