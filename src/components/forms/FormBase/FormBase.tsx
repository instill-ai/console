import { Nullable } from "@/types/general";
import { FC } from "react";
import cn from "clsx";

export type FormBaseProps = {
  padding: Nullable<string>;
};

const FormBase: FC<FormBaseProps> = ({ children, padding }) => {
  return (
    <form className={cn("flex flex-col gap-y-5", padding)}>{children}</form>
  );
};

export default FormBase;
