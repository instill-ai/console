import { GeneralRecord, Nullable } from "instill-sdk";
import yaml from "js-yaml";
import SourceMap from "js-yaml-source-map";

import { SourceLocation } from "./types";

export type EditorKeyLineNumberMap = {
  key: string;
  dotPath: string;
  lineNumber: number;
};

function getAllComponentKeyLineNumberMaps(
  recipe: string,
): EditorKeyLineNumberMap[] {
  const componentKeyLineNumberMap: EditorKeyLineNumberMap[] = [];
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

function getTopLevelKeyLineNumberMaps(
  recipe: string,
): EditorKeyLineNumberMap[] {
  const componentKeyLineNumberMap: EditorKeyLineNumberMap[] = [];
  const yamlSourceMap: SourceMap = new SourceMap();

  let yamlData: Nullable<GeneralRecord> = null;

  try {
    yamlData = yaml.load(recipe, {
      listener: yamlSourceMap.listen(),
    }) as GeneralRecord;
  } catch (error) {
    return componentKeyLineNumberMap;
  }

  if (!yamlData) {
    return componentKeyLineNumberMap;
  }

  if (yamlData.component) {
    const location: SourceLocation | undefined =
      yamlSourceMap.lookup("component");
    if (location) {
      componentKeyLineNumberMap.push({
        key: "component",
        dotPath: "component",
        lineNumber: location?.line - 1,
      });
    }
  }

  if (yamlData.variable) {
    const location: SourceLocation | undefined =
      yamlSourceMap.lookup("variable");
    if (location) {
      componentKeyLineNumberMap.push({
        key: "variable",
        dotPath: "variable",
        lineNumber: location?.line - 1,
      });
    }
  }

  if (yamlData.output) {
    const location: SourceLocation | undefined = yamlSourceMap.lookup("output");
    if (location) {
      componentKeyLineNumberMap.push({
        key: "output",
        dotPath: "output",
        lineNumber: location?.line - 1,
      });
    }
  }

  return componentKeyLineNumberMap.sort((a, b) => a.lineNumber - b.lineNumber);
}

export const keyLineNumberMapHelpers = {
  getAllComponentKeyLineNumberMaps,
  getTopLevelKeyLineNumberMaps,
};
