import * as React from "react";
import { FieldRoot } from "./FieldRoot";
import { Nullable } from "../../../type";

export type ObjectArrayFieldProps = {
  nodeType: "end" | "connector";
  title: Nullable<string>;
  children: React.ReactNode;
  hideField?: boolean;
};

export const ObjectArrayField = (props: ObjectArrayFieldProps) => {
  const { title, children, hideField } = props;

  return (
    <FieldRoot title={title} key={`${title}-field`}>
      {!hideField ? children : null}
    </FieldRoot>
  );
};
