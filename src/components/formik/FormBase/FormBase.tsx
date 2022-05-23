import { Nullable } from "@/types/general";
import { FC } from "react";
import cn from "clsx";
import { Form } from "formik";

export type FormBaseProps = {
  padding: Nullable<string>;
  gapY: Nullable<string>;
};

const FormBase: FC<FormBaseProps> = ({ children, padding, gapY }) => {
  return (
    <Form className={cn("flex h-full flex-col", padding, gapY)}>
      {children}
    </Form>
  );
};

export default FormBase;
