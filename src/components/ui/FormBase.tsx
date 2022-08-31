import { Nullable } from "@/types/general";
import { FC, FormEvent, useCallback } from "react";
import cn from "clsx";

export type FormBaseProps = {
  padding: Nullable<string>;
  flex1: Nullable<boolean>;
  marginBottom: Nullable<string>;
  noValidate: boolean;
};

const FormBase: FC<FormBaseProps> = ({
  children,
  padding,
  marginBottom,
  noValidate,
  flex1,
}) => {
  const submitHandler = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }, []);

  return (
    <form
      onSubmit={submitHandler}
      className={cn("flex h-full flex-col", padding, marginBottom, {
        "flex-1": flex1,
      })}
      noValidate={noValidate}
    >
      {children}
    </form>
  );
};

export default FormBase;
