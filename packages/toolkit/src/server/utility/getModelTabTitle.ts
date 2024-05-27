const ModelTabsDictionary = {
  overview: "Overview",
  api: "API",
  examples: "Examples",
  predictions: "Predictions",
  versions: "Versions",
  settings: "Settings",
};

export type ModelTabNames = keyof typeof ModelTabsDictionary;

export const getModelTabTitle = (tabName: ModelTabNames = "overview") => {
  return ModelTabsDictionary[tabName] || ModelTabsDictionary.overview;
};
