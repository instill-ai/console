const ModelTabsDictionary = {
  playground: "Playground",
  api: "API",
  examples: "Examples",
  predictions: "Predictions",
  versions: "Versions",
  settings: "Settings",
  readme: "README",
  runs: "Runs",
};

export type ModelTabNames = keyof typeof ModelTabsDictionary;

export const getModelTabTitle = (tabName: ModelTabNames = "playground") => {
  return ModelTabsDictionary[tabName] || ModelTabsDictionary.playground;
};
