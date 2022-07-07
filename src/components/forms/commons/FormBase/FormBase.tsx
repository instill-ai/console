import { Nullable } from "@/types/general";
import { FC, FormEvent, useCallback } from "react";
import cn from "clsx";
import { Form } from "formik";

export type FormBaseProps = {
  padding: Nullable<string>;
  marginBottom: Nullable<string>;
  noValidate: boolean;
};

const FormBase: FC<FormBaseProps> = ({
  children,
  padding,
  marginBottom,
  noValidate,
}) => {
  const submitHandler = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }, []);

  return (
    <form
      onSubmit={submitHandler}
      className={cn("flex h-full flex-col", padding, marginBottom)}
      noValidate={noValidate}
    >
      {children}
    </form>
  );
};

export default FormBase;
