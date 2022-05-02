import React from "react";

export type FormikProps = {
  onSubmit?: (values: any) => void;
  validationSchema?: () => void;
};

export const FormikStep: React.FC = ({ children }) => {
  return <>{children}</>;
};
