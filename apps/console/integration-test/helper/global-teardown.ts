import {
  deleteAllDestinations,
  deleteAllModels,
  deleteAllPipelines,
  deleteAllSources,
} from ".";

async function globalTeardown() {
  try {
    await deleteAllModels();
    await deleteAllDestinations();
    await deleteAllPipelines();
    await deleteAllSources();
  } catch (err) {
    console.error(err);
  }
}

export default globalTeardown;
