import {
  deleteAllDestinations,
  deleteAllModels,
  deleteAllPipelines,
  deleteAllSources,
} from ".";

async function globalTeardown() {
  await deleteAllModels();
  await deleteAllDestinations();
  await deleteAllPipelines();
  await deleteAllSources();
}

export default globalTeardown;
