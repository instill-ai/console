import { GeneralRecord, Nullable } from "instill-sdk";
import yaml from "js-yaml";
import SourceMap from "js-yaml-source-map";

import { SourceLocation } from "./types";

export type ComponentKeyLineNumberMap = {
  key: string;
  dotPath: string;
  lineNumber: number;
};

export function getAllComponentKeyLineNumberMaps(
  recipe: string,
): ComponentKeyLineNumberMap[] {
  const componentKeyLineNumberMap: ComponentKeyLineNumberMap[] = [];
  const yamlSourceMap: SourceMap = new SourceMap();

  let yamlData: Nullable<GeneralRecord> = null;

  try {
    yamlData = yaml.load(recipe, {
      listener: yamlSourceMap.listen(),
    }) as GeneralRecord;
  } catch (error) {
    return componentKeyLineNumberMap;
  }

  // get all the component key
  const yamlComponent = yamlData?.component as GeneralRecord | undefined;

  if (!yamlComponent) {
    return componentKeyLineNumberMap;
  }

  const componentKeyPaths: string[] = [];

  for (const key in yamlComponent) {
    componentKeyPaths.push(`component.${key}`);
  }

  for (const componentKeyPath of componentKeyPaths) {
    const propertyLocation: SourceLocation | undefined =
      yamlSourceMap.lookup(componentKeyPath);

    if (propertyLocation) {
      componentKeyLineNumberMap.push({
        key: componentKeyPath.replace("component.", ""),
        dotPath: componentKeyPath,
        lineNumber: propertyLocation.line - 1,
      });
    }
  }

  return componentKeyLineNumberMap.sort((a, b) => a.lineNumber - b.lineNumber);
}
