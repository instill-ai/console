import * as React from "react";
import { InstillFormTree } from "../type";
import { ComponentOutputFields } from "../components";
import { GeneralRecord, Nullable } from "../../type";

export type PickComponentOutputFieldsFromInstillFormTreeProps = {
  tree: InstillFormTree;
  data: Nullable<Record<string, any>>;
  nodeType: "end" | "connector";
  chooseTitleFrom?: "title" | "path";
  hideField?: boolean;
};

export function pickComponentOutputFieldsFromInstillFormTree(
  props: PickComponentOutputFieldsFromInstillFormTreeProps
) {
  // 1. Preprocess

  const { tree, nodeType, data, chooseTitleFrom, hideField } = props;

  let title = tree.path ?? tree.title ?? null;

  if (chooseTitleFrom === "title") {
    title = tree.title ?? null;
  }

  // Process value
  let propertyValue: any = null;

  if (tree._type === "formGroup") {
    propertyValue = data ?? null;
  } else if (tree._type === "objectArray") {
    if (tree.fieldKey) {
      propertyValue = data
        ? Array.isArray(data[tree.fieldKey])
          ? data[tree.fieldKey]
          : null
        : null;
    } else {
      propertyValue = Array.isArray(data) ? data : null;
    }
  } else if (tree._type === "formItem") {
    if (tree.fieldKey) {
      propertyValue = data ? data[tree.fieldKey] ?? null : null;
    }
  }

  // 2. Main process

  // Process formGroup
  if (tree._type === "formGroup") {
    return tree.fieldKey ? (
      <div
        key={tree.path || tree.fieldKey}
        className="flex flex-col gap-y-2 rounded-sm border border-semantic-bg-line p-2"
      >
        <p className="text-semantic-fg-secondary product-body-text-4-semibold">
          {tree.fieldKey || tree.path}
        </p>
        {tree.properties.map((property) => {
          return pickComponentOutputFieldsFromInstillFormTree({
            ...props,
            tree: property,
            data: propertyValue,
          });
        })}
      </div>
    ) : (
      <React.Fragment key={tree.path || tree.fieldKey}>
        {tree.properties.map((property) => {
          return pickComponentOutputFieldsFromInstillFormTree({
            ...props,
            tree: property,
            data: propertyValue,
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
  // Becase we don't know the index of the output objectArray, we need to user
  // the data as a hint here

  if (tree._type === "objectArray") {
    const objectArrayData = propertyValue as GeneralRecord[];

    return propertyValue ? (
      <div key={tree.path || tree.fieldKey} className="flex flex-col gap-y-2">
        {objectArrayData.map((data) =>
          pickComponentOutputFieldsFromInstillFormTree({
            ...props,
            tree: tree.properties,
            data: data,
          })
        )}
      </div>
    ) : (
      <React.Fragment key={tree.path || tree.fieldKey}>
        {pickComponentOutputFieldsFromInstillFormTree({
          ...props,
          tree: tree.properties,
          data: propertyValue,
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
        title={title}
        text={propertyValue}
        hideField={hideField}
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
            title={title}
            texts={propertyValue}
            hideField={hideField}
          />
        );
      }
      case "audio": {
        return (
          <ComponentOutputFields.AudiosField
            nodeType={nodeType}
            title={title}
            audios={propertyValue}
            hideField={hideField}
          />
        );
      }
      case "image": {
        return (
          <ComponentOutputFields.ImagesField
            nodeType={nodeType}
            title={title}
            images={propertyValue}
            hideField={hideField}
          />
        );
      }
      case "text": {
        return (
          <ComponentOutputFields.TextsField
            nodeType={nodeType}
            title={title}
            texts={propertyValue}
            hideField={hideField}
          />
        );
      }
      default: {
        return (
          <ComponentOutputFields.TextField
            nodeType={nodeType}
            title={title}
            text={propertyValue}
            hideField={hideField}
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
          title={title}
          text={propertyValue}
          hideField={hideField}
        />
      );
    }
    case "audio": {
      return (
        <ComponentOutputFields.AudioField
          nodeType={nodeType}
          title={title}
          audio={propertyValue}
          hideField={hideField}
        />
      );
    }
    case "image": {
      return (
        <ComponentOutputFields.ImageField
          nodeType={nodeType}
          title={title}
          image={propertyValue}
          hideField={hideField}
        />
      );
    }
    case "text": {
      return (
        <ComponentOutputFields.TextField
          nodeType={nodeType}
          title={title}
          text={propertyValue}
          hideField={hideField}
        />
      );
    }
    default: {
      return (
        <ComponentOutputFields.TextField
          nodeType={nodeType}
          title={title}
          text={propertyValue}
          hideField={hideField}
        />
      );
    }
  }
}
