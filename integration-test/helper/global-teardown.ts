import {
  deleteAllDestinations,
  deleteAllModels,
  deleteAllPipelines,
  deleteAllSources,
} from ".";

export async function globalTeardown() {
  try {
    await deleteAllModels();
    await deleteAllDestinations();
    await deleteAllPipelines();
    await deleteAllSources();
  } catch (err) {
    console.log(err);
  }
}
