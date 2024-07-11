const PipelineTabsDictionary = {
  playground: "Playground",
  api: "API",
  examples: "Examples",
  preview: "Preview",
  runs: "Runs",
  versions: "Versions",
  settings: "Settings",
  readme: "README",
};

export type PipelineTabNames = keyof typeof PipelineTabsDictionary;

export const getPipelineTabTitle = (
  tabName: PipelineTabNames = "playground",
) => {
  return PipelineTabsDictionary[tabName] || PipelineTabsDictionary.playground;
};
