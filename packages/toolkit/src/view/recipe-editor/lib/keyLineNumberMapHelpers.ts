import { GeneralRecord } from "instill-sdk";
import YAML from "yaml";

export type EditorKeyLineNumberMap = {
  key: string;
  dotPath: string;
  lineNumber: number;
};

function getAllComponentKeyLineNumberMaps(
  recipe: string,
): EditorKeyLineNumberMap[] {
  const componentKeyLineNumberMap: EditorKeyLineNumberMap[] = [];
  const lineCounter = new YAML.LineCounter();
  const yamlData = YAML.parse(recipe);
  const doc = YAML.parseAllDocuments<YAML.YAMLMap>(recipe, { lineCounter });
  const yamlComponent = yamlData?.component as GeneralRecord | undefined;

  if (!yamlComponent || !doc || !doc[0]) {
    return componentKeyLineNumberMap;
  }

  for (const key in yamlComponent) {
    const node = doc[0].getIn(["component", key], true) as YAML.Node;
    if (node && node.range) {
      // The line counter of YAML.MAP type has some offset issue
      const line = lineCounter.linePos(node.range[0]).line;
      const adjustedLine = node instanceof YAML.Scalar ? line : line - 1;
      componentKeyLineNumberMap.push({
        key,
        dotPath: `component.${key}`,
        lineNumber: adjustedLine,
      });
    }
  }

  return componentKeyLineNumberMap.sort((a, b) => a.lineNumber - b.lineNumber);
}

function getAllRunOnEventKeyLineNumberMaps(
  recipe: string,
): EditorKeyLineNumberMap[] {
  const runOnEventKeyLineNumberMap: EditorKeyLineNumberMap[] = [];
  const lineCounter = new YAML.LineCounter();
  const yamlData = YAML.parse(recipe);
  const doc = YAML.parseAllDocuments<YAML.YAMLMap>(recipe, { lineCounter });
  const yamlRunOnEvent = yamlData?.on as GeneralRecord | undefined;

  if (!yamlRunOnEvent || !doc || !doc[0]) {
    return runOnEventKeyLineNumberMap;
  }

  for (const key in yamlRunOnEvent) {
    const node = doc[0].getIn(["on", key], true) as YAML.Node;
    if (node && node.range) {
      // The line counter of YAML.MAP type has some offset issue
      const line = lineCounter.linePos(node.range[0]).line;
      const adjustedLine = node instanceof YAML.Scalar ? line : line - 1;
      runOnEventKeyLineNumberMap.push({
        key,
        dotPath: `on.${key}`,
        lineNumber: adjustedLine,
      });
    }
  }

  return runOnEventKeyLineNumberMap.sort((a, b) => a.lineNumber - b.lineNumber);
}

function getComponentTopLevelKeyLineNumberMaps(
  recipe: string,
  componentKey: string,
) {
  const componentKeyLineNumberMap: EditorKeyLineNumberMap[] = [];
  const lineCounter = new YAML.LineCounter();
  const yamlData = YAML.parse(recipe);
  const doc = YAML.parseAllDocuments<YAML.YAMLMap>(recipe, { lineCounter });
  const yamlComponent = yamlData?.component as GeneralRecord | undefined;

  if (!yamlComponent || !doc || !doc[0]) {
    return componentKeyLineNumberMap;
  }

  const targetComponent = yamlComponent[componentKey] as
    | GeneralRecord
    | undefined;

  if (!targetComponent) {
    return componentKeyLineNumberMap;
  }

  for (const key in targetComponent) {
    const node = doc[0].getIn(
      ["component", componentKey, key],
      true,
    ) as YAML.Node;

    if (node && node.range) {
      // The line counter of YAML.MAP type has some offset issue
      const line = lineCounter.linePos(node.range[0]).line;
      const adjustedLine = node instanceof YAML.Scalar ? line : line - 1;
      componentKeyLineNumberMap.push({
        key,
        dotPath: `component.${componentKey}.${key}`,
        lineNumber: adjustedLine,
      });
    }
  }

  return componentKeyLineNumberMap.sort((a, b) => a.lineNumber - b.lineNumber);
}

function getRecipeTopLevelKeyLineNumberMaps(
  recipe: string,
): EditorKeyLineNumberMap[] {
  const componentKeyLineNumberMap: EditorKeyLineNumberMap[] = [];
  const lineCounter = new YAML.LineCounter();
  const yamlData = YAML.parse(recipe);
  const doc = YAML.parseAllDocuments<YAML.YAMLMap>(recipe, { lineCounter });

  if (!doc || !doc[0]) {
    return componentKeyLineNumberMap;
  }

  if (yamlData.component) {
    const node = doc[0].getIn(["component"], true) as YAML.Node;
    if (node && node.range) {
      const line = lineCounter.linePos(node.range[0]).line;
      const adjustedLine = node instanceof YAML.Scalar ? line : line - 1;
      componentKeyLineNumberMap.push({
        key: "component",
        dotPath: "component",
        lineNumber: adjustedLine,
      });
    }
  }

  if (yamlData.variable) {
    const node = doc[0].getIn(["variable"], true) as YAML.Node;
    if (node && node.range) {
      const line = lineCounter.linePos(node.range[0]).line;
      const adjustedLine = node instanceof YAML.Scalar ? line : line - 1;
      componentKeyLineNumberMap.push({
        key: "variable",
        dotPath: "variable",
        lineNumber: adjustedLine,
      });
    }
  }

  if (yamlData.output) {
    const node = doc[0].getIn(["output"], true) as YAML.Node;
    if (node && node.range) {
      const line = lineCounter.linePos(node.range[0]).line;
      const adjustedLine = node instanceof YAML.Scalar ? line : line - 1;
      componentKeyLineNumberMap.push({
        key: "output",
        dotPath: "output",
        lineNumber: adjustedLine,
      });
    }
  }

  if (yamlData.on) {
    const node = doc[0].getIn(["on"], true) as YAML.Node;
    if (node && node.range) {
      const line = lineCounter.linePos(node.range[0]).line;
      const adjustedLine = node instanceof YAML.Scalar ? line : line - 1;
      componentKeyLineNumberMap.push({
        key: "on",
        dotPath: "on",
        lineNumber: adjustedLine,
      });
    }
  }

  return componentKeyLineNumberMap.sort((a, b) => a.lineNumber - b.lineNumber);
}

export const keyLineNumberMapHelpers = {
  getAllComponentKeyLineNumberMaps,
  getAllRunOnEventKeyLineNumberMaps,
  getRecipeTopLevelKeyLineNumberMaps,
  getComponentTopLevelKeyLineNumberMaps,
};
