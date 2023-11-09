import * as React from "react";
import { ConnectorNodeFieldRoot, EndNodeFieldRoot } from "./FieldRoot";
import { Nullable } from "../../../type";

export type ObjectArrayFieldProps = {
  nodeType: "end" | "connector";
  title: Nullable<string>;
  children: React.ReactNode;
  hideField?: boolean;
};

export const ObjectArrayField = (props: ObjectArrayFieldProps) => {
  const { nodeType, title, children, hideField } = props;

  if (nodeType === "connector") {
    return (
      <ConnectorNodeFieldRoot title={title} key={`${title}-field`}>
        {!hideField ? children : null}
      </ConnectorNodeFieldRoot>
    );
  }

  return (
    <EndNodeFieldRoot title={title} key={`${title}-field`}>
      {!hideField ? children : null}{" "}
    </EndNodeFieldRoot>
  );
};
