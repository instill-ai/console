import { Nullable } from "@/types/general";
import { FC, FormEvent, useCallback } from "react";
import cn from "clsx";
import { Form } from "formik";

export type FormBaseProps = {
  padding: Nullable<string>;
  gapY: Nullable<string>;
  marginBottom: Nullable<string>;
};

const FormBase: FC<FormBaseProps> = ({
  children,
  padding,
  gapY,
  marginBottom,
}) => {
  const submitHandler = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }, []);

  return (
    <form
      onSubmit={submitHandler}
      className={cn("flex h-full flex-col", padding, gapY, marginBottom)}
    >
      {children}
    </form>
  );
};

export default FormBase;
