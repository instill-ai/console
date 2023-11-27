import * as React from "react";
import { InstillFormTree } from "../type";
import { ComponentOutputFields } from "../components";
import { GeneralRecord, Nullable } from "../../type";
import { dot } from "../../dot";

export type PickComponentOutputFieldsFromInstillFormTreeProps = {
  tree: InstillFormTree;
  data: Nullable<Record<string, any>>;
  chooseTitleFrom?: "title" | "path";
  hideField?: boolean;
  objectArrayIndex?: number;
};

export function pickComponentOutputFieldsFromInstillFormTree(
  props: PickComponentOutputFieldsFromInstillFormTreeProps
) {
  // 1. Preprocess

  const { tree, data, chooseTitleFrom, hideField } = props;

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
    if (tree.path) {
      propertyValue = data ? dot.getter(data, tree.path) ?? null : null;
    }
  }

  // 2. Main process

  // Process formGroup
  if (tree._type === "formGroup") {
    return tree.fieldKey ? (
      <div
        key={`${tree.path || tree.fieldKey}-${props.objectArrayIndex}`}
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
      <React.Fragment
        key={`${tree.path || tree.fieldKey}-${props.objectArrayIndex}`}
      >
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

    return propertyValue && tree.fieldKey ? (
      <div key={tree.path || tree.fieldKey} className="flex flex-col gap-y-2">
        {objectArrayData.map((data, idx) => {
          return pickComponentOutputFieldsFromInstillFormTree({
            ...props,
            tree: tree.properties,

            // Because we are using path to get the value, we need to restructure
            // the data here. The object array data will be data: [{foo: 1}, {foo: 2}],
            // Down below the formTree the foo field's path is data.foo
            // So we need to restructure the data to {data:{foo: 1}} and {data:{foo: 2}}
            data: {
              [tree.fieldKey as string]: data,
            },
            objectArrayIndex: idx,
          });
        })}
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
  if (tree.instillFormat === "string" || tree.instillFormat === "boolean") {
    return (
      <ComponentOutputFields.TextField
        title={title}
        text={propertyValue}
        hideField={hideField}
      />
    );
  }

  if (tree.instillFormat === "number" || tree.instillFormat === "integer") {
    return (
      <ComponentOutputFields.NumberField
        title={title}
        number={propertyValue}
        hideField={hideField}
      />
    );
  }

  if (tree.type === "array") {
    const arrayType = tree.instillFormat.replaceAll("array:", "").split("/")[0];

    switch (arrayType) {
      case "number":
      case "integer": {
        return (
          <ComponentOutputFields.NumbersField
            title={title}
            numbers={propertyValue}
            hideField={hideField}
          />
        );
      }
      case "boolean":
      case "string": {
        return (
          <ComponentOutputFields.TextsField
            title={title}
            texts={propertyValue}
            hideField={hideField}
          />
        );
      }
      case "audio": {
        return (
          <ComponentOutputFields.AudiosField
            title={title}
            audios={propertyValue}
            hideField={hideField}
          />
        );
      }
      case "image": {
        return (
          <ComponentOutputFields.ImagesField
            title={title}
            images={propertyValue}
            hideField={hideField}
          />
        );
      }
      case "text": {
        return (
          <ComponentOutputFields.TextsField
            title={title}
            texts={propertyValue}
            hideField={hideField}
          />
        );
      }
      default: {
        return (
          <ComponentOutputFields.TextsField
            title={title}
            texts={propertyValue}
            hideField={hideField}
          />
        );
      }
    }
  }

  // Process singular types
  const singularType = tree.instillFormat.split("/")[0];

  switch (singularType) {
    case "number":
    case "integer":
    case "boolean":
    case "string": {
      return (
        <ComponentOutputFields.TextField
          title={title}
          text={propertyValue}
          hideField={hideField}
        />
      );
    }
    case "audio": {
      return (
        <ComponentOutputFields.AudioField
          title={title}
          audio={propertyValue}
          hideField={hideField}
        />
      );
    }
    case "image": {
      return (
        <ComponentOutputFields.ImageField
          title={title}
          image={propertyValue}
          hideField={hideField}
        />
      );
    }
    case "text": {
      return (
        <ComponentOutputFields.TextField
          title={title}
          text={propertyValue}
          hideField={hideField}
        />
      );
    }
    default: {
      return (
        <ComponentOutputFields.TextField
          title={title}
          text={propertyValue}
          hideField={hideField}
        />
      );
    }
  }
}
