import cn from "clsx";
import { Nullable } from "../lib";

/*
  Usage:

  // You need to make sure all the padding and text styles are the same as
  // the input element you're using.

  const textStyle = "text-sm font-medium p-2"
  const [value] = React.useState("")

  <AutoresizeInputWrapper
    value={field.value ?? ""}
    className="min-w-[280px] max-w-[400px] h-12"
    placeholderClassname={textStyle}
  >
    <input
      className={cn(
        "!absolute !bottom-0 !left-0 !right-0 !top-0 p-2",
        textStyle
      )}
      value={value}
    />
  </AutoresizeInputWrapper>

*/

export const AutoresizeInputWrapper = ({
  placeholderClassname,
  value,
  className,
  children,
}: {
  value: Nullable<string>;
  className?: string;
  children: React.ReactNode;
  placeholderClassname?: string;
}) => {
  return (
    <div className="flex">
      <div className={cn("relative", className)}>
        <div
          className={cn(
            "invisible !m-0 box-border h-full border-none",
            placeholderClassname
          )}
          contentEditable={true}
          suppressContentEditableWarning={true}
        >
          {value}
        </div>
        {children}
      </div>
    </div>
  );
};
