import cn from "clsx";
import * as React from "react";

const Root = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div
      className={cn("group flex flex-col space-y-1", className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});
Root.displayName = "FieldRoot";

const Description = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<"p">
>(({ className, children, ...props }, ref) => {
  return (
    <p
      className={cn(
        "flex text-[#1D2433CC] product-body-text-3-regular",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </p>
  );
});
Description.displayName = "FieldDescription";

const Label = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<"label">
>(({ className, children, ...props }, ref) => {
  return (
    <label
      className={cn(
        "flex text-semantic-fg-primary product-body-text-2-semibold",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </label>
  );
});
Label.displayName = "FieldLabel";

export const Field = {
  Root,
  Description,
  Label,
};
