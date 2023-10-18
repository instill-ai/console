import * as React from "react";
import cn from "clsx";

export type FormRootProps = {
  children?: React.ReactNode;

  /**
   * #### Whether to use the <form><form> to wrap the children
   * - Default is true
   */
  formLess?: boolean;

  /**
   * - Default is w-full
   */
  width?: string;

  /**
   * - Default is undefinded
   */
  marginBottom?: string;
};

export const FormRoot = ({
  children,
  marginBottom,
  formLess,
  width,
}: FormRootProps) => {
  const submitHandler = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    },
    []
  );

  return formLess ? (
    <div
      className={cn("flex flex-col", marginBottom, width ? width : "w-full")}
    >
      {children}
    </div>
  ) : (
    <form
      onSubmit={submitHandler}
      className={cn("flex flex-col", marginBottom, width ? width : "w-full")}
      noValidate={true}
    >
      {children}
    </form>
  );
};
