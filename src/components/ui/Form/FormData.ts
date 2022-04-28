import React from "react";

export type FormField = {
  id: string;
  component: "text" | "textarea" | "select";
  type: "email" | "password" | "text";
  label: string;
  description?: string;
  required: boolean;
  readonly: boolean;
  placeholder?: string;
  pattern?: string;
  options?: Option[];
};

export type Option = {
  label: string;
  value: string | number;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
};
