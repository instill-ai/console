import * as React from "react";
import { ConnectorNodeFieldRoot, EndNodeFieldRoot } from "./FieldRoot";
import { Nullable } from "../../../type";

export type ObjectArrayFieldProps = {
  nodeType: "end" | "connector";
  title: Nullable<string>;
  children: React.ReactNode;
};

export const ObjectArrayField = (props: ObjectArrayFieldProps) => {
  const { nodeType, title, children } = props;

  if (nodeType === "connector") {
    return (
      <ConnectorNodeFieldRoot title={title} key={`${title}-field`}>
        {children}
      </ConnectorNodeFieldRoot>
    );
  }

  return (
    <EndNodeFieldRoot title={title} key={`${title}-field`}>
      {children}
    </EndNodeFieldRoot>
  );
};
