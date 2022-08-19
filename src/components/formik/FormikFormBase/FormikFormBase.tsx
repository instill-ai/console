import { Nullable } from "@/types/general";
import { FC } from "react";
import cn from "clsx";
import { Form } from "formik";

export type FormikFormBaseProps = {
  padding: Nullable<string>;
  gapY: Nullable<string>;
  marginBottom: Nullable<string>;
  minWidth: Nullable<string>;
};

const FormikFormBase: FC<FormikFormBaseProps> = ({
  children,
  padding,
  gapY,
  marginBottom,
  minWidth,
}) => {
  return (
    <Form
      className={cn(
        "flex h-full flex-col",
        padding,
        gapY,
        marginBottom,
        minWidth
      )}
    >
      {children}
    </Form>
  );
};

export default FormikFormBase;
