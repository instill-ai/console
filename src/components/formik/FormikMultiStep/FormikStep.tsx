import React from "react";

type SubmitFunction = (values: any) => void;

export type FormikProps = {
  onSubmit?: SubmitFunction | Record<string, SubmitFunction>;
  validationSchema?: () => void;
  multiGroup?: boolean;
};

export const FormikStep: React.FC<FormikProps> = ({ children }) => {
  return <>{children}</>;
};
