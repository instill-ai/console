import * as React from "react";

import { GeneralRecord, Nullable } from "../../type";
import { ComponentOutputFields } from "../components";
import { ChooseTitleFrom, FieldMode, InstillFormTree } from "../types";

export type PickComponentOutputFieldsFromInstillFormTreeProps = {
  tree: InstillFormTree;
  data: Nullable<GeneralRecord>;
  mode: FieldMode;
  chooseTitleFrom?: ChooseTitleFrom;
  hideField?: boolean;
  objectArrayIndex?: number;
  forceFormatted?: boolean;
};

export function pickComponentOutputFieldsFromInstillFormTree(
  props: PickComponentOutputFieldsFromInstillFormTreeProps,
) {
  // 1. Preprocess

  const { tree, data, chooseTitleFrom, hideField, mode, forceFormatted } =
    props;

  let title: Nullable<string> = null;

  if (chooseTitleFrom === "title") {
    title = tree.title ?? tree.fieldKey;
  } else if (chooseTitleFrom === "key") {
    title = tree.fieldKey ?? tree.title ?? null;
  } else {
    title = tree.path ?? tree.fieldKey ?? tree.title ?? null;
  }

  // Process value
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  let propertyValue: any = null;

  if (tree._type === "formGroup") {
    if (tree.fieldKey) {
      propertyValue = data ? data[tree.fieldKey] : null;
    } else {
      propertyValue = data ?? null;
    }
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
      propertyValue = data ? data[tree.fieldKey] : null;
    }
  } else if (tree._type === "arrayArray") {
    if (tree.fieldKey) {
      propertyValue = data
        ? Array.isArray(data[tree.fieldKey])
          ? data[tree.fieldKey]
          : null
        : null;
    } else {
      propertyValue = null;
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
          {title}
        </p>
        {tree.properties
          .sort((a, b) => {
            if (a.instillUIOrder && b.instillUIOrder) {
              return a.instillUIOrder - b.instillUIOrder;
            }

            return 0;
          })
          .map((property) => {
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
        {tree.properties
          .sort((a, b) => {
            if (a.instillUIOrder && b.instillUIOrder) {
              return a.instillUIOrder - b.instillUIOrder;
            }

            return 0;
          })
          .map((property) => {
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
  // Becase we don't know the index of the output objectArray, we need to use
  // the data as a hint here

  if (tree._type === "objectArray") {
    const objectArrayData = propertyValue as GeneralRecord[];
    return propertyValue && tree.fieldKey ? (
      <div key={tree.path || tree.fieldKey} className="flex flex-col gap-y-2">
        {objectArrayData.map((object, idx) => {
          return pickComponentOutputFieldsFromInstillFormTree({
            ...props,
            tree: tree.properties,

            // Because we are using path to get the value, we need to restructure
            // the data here. The object array data will be data: [{foo: 1}, {foo: 2}],
            // Down below the formTree the foo field's path is data.foo
            // So we need to restructure the data to {data:{foo: 1}} and {data:{foo: 2}}
            data: {
              [tree.fieldKey as string]: object,
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

  if (tree._type === "arrayArray") {
    const arrayArrayData = propertyValue as GeneralRecord[];

    return propertyValue && Array.isArray(arrayArrayData) ? (
      <div key={tree.path || tree.fieldKey} className="flex flex-col gap-y-2">
        {arrayArrayData.map((data) => {
          return pickComponentOutputFieldsFromInstillFormTree({
            ...props,
            tree: tree.items,
            data: {
              [tree.fieldKey as string]: data,
            },
          });
        })}
      </div>
    ) : null;
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
        mode={mode}
        title={title}
        text={propertyValue}
        hideField={hideField}
        forceFormatted={forceFormatted}
      />
    );
  }

  if (tree.instillFormat === "number" || tree.instillFormat === "integer") {
    return (
      <ComponentOutputFields.NumberField
        mode={mode}
        title={title}
        number={propertyValue}
        hideField={hideField}
      />
    );
  }

  if (tree.instillFormat.includes("array:")) {
    const arrayType = tree.instillFormat.replaceAll("array:", "").split("/")[0];

    if (arrayType?.includes("structured") || arrayType === "json") {
      // Some time even the type hint is array:semi-structured, backend will still be possible
      // to return array of string or array of number. So we need to handle that case here
      if (Array.isArray(propertyValue) && propertyValue.length > 0) {
        const firstElement = propertyValue[0];
        if (
          typeof firstElement === "string" ||
          typeof firstElement === "number" ||
          typeof firstElement === "boolean"
        ) {
          return (
            <ComponentOutputFields.ObjectField
              mode={mode}
              title={title}
              object={propertyValue}
              hideField={hideField}
            />
          );
        }
      }

      return (
        <ComponentOutputFields.ObjectsField
          mode={mode}
          title={title}
          objects={propertyValue}
          hideField={hideField}
        />
      );
    }

    switch (arrayType) {
      case "number":
      case "integer": {
        return (
          <ComponentOutputFields.NumbersField
            mode={mode}
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
            mode={mode}
            title={title}
            texts={propertyValue}
            hideField={hideField}
            forceFormatted={forceFormatted}
          />
        );
      }
      case "audio": {
        return (
          <ComponentOutputFields.AudiosField
            mode={mode}
            title={title}
            audios={propertyValue}
            hideField={hideField}
          />
        );
      }
      case "image": {
        return (
          <ComponentOutputFields.ImagesField
            mode={mode}
            title={title}
            images={propertyValue}
            hideField={hideField}
          />
        );
      }
      case "video": {
        return (
          <ComponentOutputFields.VideosField
            mode={mode}
            title={title}
            videos={propertyValue}
            hideField={hideField}
          />
        );
      }
      case "text": {
        return (
          <ComponentOutputFields.TextsField
            mode={mode}
            title={title}
            texts={propertyValue}
            hideField={hideField}
            forceFormatted={forceFormatted}
          />
        );
      }
      case "file":
      case "document": {
        return (
          <ComponentOutputFields.DownloadableFilesField
            mode={mode}
            title={title}
            files={propertyValue}
            hideField={hideField}
          />
        );
      }

      default: {
        return (
          <ComponentOutputFields.TextsField
            mode={mode}
            title={title}
            texts={propertyValue}
            hideField={hideField}
            forceFormatted={forceFormatted}
          />
        );
      }
    }
  }

  // Process singular types
  const singularType = tree.instillFormat.split("/")[0];

  // Process structured type like semi-structured, structured/detection_object...etc
  if (singularType?.includes("structured") || singularType === "json") {
    return (
      <ComponentOutputFields.ObjectField
        mode={mode}
        title={title}
        object={propertyValue}
        hideField={hideField}
      />
    );
  }

  switch (singularType) {
    case "number":
    case "integer":
    case "boolean":
    case "string": {
      return (
        <ComponentOutputFields.TextField
          mode={mode}
          title={title}
          text={propertyValue}
          hideField={hideField}
          forceFormatted={forceFormatted}
        />
      );
    }
    case "audio": {
      return (
        <ComponentOutputFields.AudioField
          mode={mode}
          title={title}
          audio={propertyValue}
          hideField={hideField}
        />
      );
    }
    case "video": {
      return (
        <ComponentOutputFields.VideoField
          mode={mode}
          title={title}
          video={propertyValue}
          hideField={hideField}
        />
      );
    }
    case "image": {
      return (
        <ComponentOutputFields.ImageField
          mode={mode}
          title={title}
          image={propertyValue}
          hideField={hideField}
        />
      );
    }
    case "text": {
      return (
        <ComponentOutputFields.TextField
          mode={mode}
          title={title}
          text={propertyValue}
          hideField={hideField}
          forceFormatted={forceFormatted}
        />
      );
    }
    case "semi-structured":
    case "json": {
      return (
        <ComponentOutputFields.ObjectField
          mode={mode}
          title={title}
          object={propertyValue}
          hideField={hideField}
        />
      );
    }
    case "file":
    case "document": {
      return (
        <ComponentOutputFields.DownloadableFileField
          mode={mode}
          title={title}
          file={propertyValue}
          hideField={hideField}
        />
      );
    }
    default: {
      return (
        <ComponentOutputFields.TextField
          mode={mode}
          title={title}
          text={propertyValue}
          hideField={hideField}
          forceFormatted={forceFormatted}
        />
      );
    }
  }
}
