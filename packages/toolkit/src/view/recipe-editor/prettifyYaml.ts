import * as yamlPlugin from "prettier/plugins/yaml.js";
import * as prettier from "prettier/standalone";

export async function prettifyYaml(yaml: string) {
  try {
    const prettifiedText = await prettier.format(yaml, {
      parser: "yaml",
      printWidth: 100,
      tabWidth: 2,
      useTabs: false,
      plugins: [yamlPlugin],
    });
    return Promise.resolve(prettifiedText);
  } catch (error) {
    return Promise.reject(error);
  }
}
