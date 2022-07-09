import React from "react";

/* eslint-disable  @typescript-eslint/no-explicit-any */

type SubmitFunction = (values: any) => void;

export type FormikProps = {
  onSubmit?: SubmitFunction | Record<string, SubmitFunction>;
  validationSchema?: () => void;
  multiGroup?: boolean;
};

export const FormikStep: React.FC<FormikProps> = ({ children }) => {
  return <>{children}</>;
};
