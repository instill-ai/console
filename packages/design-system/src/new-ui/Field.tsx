import cn from "clsx";
import * as React from "react";

const Root = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div
      className={cn("flex group flex-col space-y-1", className)}
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
        "flex product-body-text-3-regular text-[#1D2433CC]",
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
        "flex product-body-text-2-semibold text-semantic-fg-primary",
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
