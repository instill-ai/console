import * as React from "react";
import { InstillFormTree } from "../type";
import { ComponentOutputFields } from "../components";
import { PipelineTrace, TriggerUserPipelineResponse } from "../../vdp-sdk";
import { Nullable } from "../../type";
import { dot } from "../../dot";

export type PickComponentOutputFieldsFromInstillFormTreeProps =
  | {
      tree: InstillFormTree;
      data: Nullable<PipelineTrace>;
      nodeType: "connector";
    }
  | {
      tree: InstillFormTree;
      data: Nullable<TriggerUserPipelineResponse["outputs"]>;
      nodeType: "end";
    };

export function pickComponentOutputFieldsFromInstillFormTree(
  props: PickComponentOutputFieldsFromInstillFormTreeProps
) {
  // 1. Preprocess

  const { tree, nodeType, data } = props;

  // Process value
  let propertyValue: any = null;

  if (nodeType === "connector") {
    if (tree.path) {
      propertyValue = data?.outputs[0][tree.path] ?? null;
    }
  } else {
    if (tree.path && data && data[0]) {
      propertyValue = dot.getter(data[0], tree.path);
    }
  }

  // 2. Main process

  // Process formGroup
  if (tree._type === "formGroup") {
    return tree.fieldKey ? (
      <div
        key={tree.path || tree.fieldKey}
        className="flex flex-col gap-y-4 rounded-sm border border-semantic-bg-line p-5"
      >
        <p className="text-semantic-fg-secondary product-body-text-2-semibold">
          {tree.fieldKey || tree.path}
        </p>
        {tree.properties.map((property) => {
          return pickComponentOutputFieldsFromInstillFormTree({
            ...props,
            tree: property,
          });
        })}
      </div>
    ) : (
      <React.Fragment key={tree.path || tree.fieldKey}>
        {tree.properties.map((property) => {
          return pickComponentOutputFieldsFromInstillFormTree({
            ...props,
            tree: property,
          });
        })}
      </React.Fragment>
    );
  }

  // The component output don't have formCondition
  if (tree._type === "formCondition") {
    return null;
  }

  // Process objectArray
  if (tree._type === "objectArray") {
    return (
      <React.Fragment key={tree.path || tree.fieldKey}>
        {nodeType === "connector"
          ? pickComponentOutputFieldsFromInstillFormTree({
              tree: tree.properties,
              nodeType,
              data,
            })
          : pickComponentOutputFieldsFromInstillFormTree({
              tree: tree.properties,
              nodeType,
              data,
            })}
      </React.Fragment>
    );
  }

  // Process const field
  if (tree.const || !tree.path) {
    return null;
  }

  if (!tree.instillFormat) {
    return null;
  }

  // Process regular field
  if (
    tree.instillFormat === "string" ||
    tree.instillFormat === "number" ||
    tree.instillFormat === "integer" ||
    tree.instillFormat === "boolean"
  ) {
    return (
      <ComponentOutputFields.TextField
        nodeType={nodeType}
        title={tree.title ?? tree.path}
        text={propertyValue}
      />
    );
  }

  const [type] = tree.instillFormat.split("/");

  if (tree.type === "array") {
    switch (type) {
      case "number":
      case "integer":
      case "boolean":
      case "string": {
        return (
          <ComponentOutputFields.TextsField
            nodeType={nodeType}
            title={tree.title ?? tree.path}
            texts={propertyValue}
          />
        );
      }
      case "audio": {
        return (
          <ComponentOutputFields.AudiosField
            nodeType={nodeType}
            title={tree.title ?? tree.path}
            audios={propertyValue}
          />
        );
      }
      case "image": {
        return (
          <ComponentOutputFields.ImagesField
            nodeType={nodeType}
            title={tree.title ?? tree.path}
            images={propertyValue}
          />
        );
      }
      case "text": {
        return (
          <ComponentOutputFields.TextsField
            nodeType={nodeType}
            title={tree.title ?? tree.path}
            texts={propertyValue}
          />
        );
      }
      default: {
        return (
          <ComponentOutputFields.TextField
            nodeType={nodeType}
            title={tree.title ?? tree.path}
            text={propertyValue}
          />
        );
      }
    }
  }

  // Process singular types

  switch (type) {
    case "number":
    case "integer":
    case "boolean":
    case "string": {
      return (
        <ComponentOutputFields.TextField
          nodeType={nodeType}
          title={tree.title ?? tree.path}
          text={propertyValue}
        />
      );
    }
    case "audio": {
      return (
        <ComponentOutputFields.AudioField
          nodeType={nodeType}
          title={tree.title ?? tree.path}
          audio={propertyValue}
        />
      );
    }
    case "image": {
      return (
        <ComponentOutputFields.ImageField
          nodeType={nodeType}
          title={tree.title ?? tree.path}
          image={propertyValue}
        />
      );
    }
    case "text": {
      return (
        <ComponentOutputFields.TextField
          nodeType={nodeType}
          title={tree.title ?? tree.path}
          text={propertyValue}
        />
      );
    }
    default: {
      return (
        <ComponentOutputFields.TextField
          nodeType={nodeType}
          title={tree.title ?? tree.path}
          text={propertyValue}
        />
      );
    }
  }
}
