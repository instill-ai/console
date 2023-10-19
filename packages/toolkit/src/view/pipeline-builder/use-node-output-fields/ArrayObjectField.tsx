import * as React from "react";
import { Nullable } from "../../../lib";
import { ConnectorNodeFieldRoot, EndNodeFieldRoot } from "./FieldRoot";

export type ArrayObjectFieldProps = {
  nodeType: "end" | "connector";
  title: Nullable<string>;
  children: React.ReactNode;
};

export const ArrayObjectField = (props: ArrayObjectFieldProps) => {
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
