import * as React from "react";
import { Button } from "../Button";
import { Icons } from "../Icons";
import cn from "clsx";

type Align = "left" | "right" | "center";

const PaginationRoot = ({
  className,
  ...props
}: React.ComponentProps<"nav">) => (
  <nav role="navigation"
  aria-label="pagination" className={cn("", className)} {...props} />
);
PaginationRoot.displayName = "PaginationRoot";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul"> & { align?: Align }
>(({ className, align = "center", ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(
      `
      flex items-center justify-between py-4 w-full${" "}
      
      [&>li:first-child>*]:data-[align=center]:rounded-r-sm${" "}
      
      [&>li:last-child>*]:data-[align=center]:rounded-l-sm${" "}
      [&>li:last-child>*]:data-[align=center]:border${" "}
      
      [&>li:nth-child(2)]:data-[align=left]:order-last${" "}
      [&>li:nth-child(2)]:data-[align=left]:ml-auto${" "}
      [&>li:nth-child(2)]:data-[align=right]:order-first${" "}
      [&>li:nth-child(2)]:data-[align=right]:mr-auto
    `,
      className
    )}
    data-align={align}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof Button>) => (
  <Button
    className={cn(
      "gap-x-2 rounded-l-sm rounded-r-none !border-semantic-bg-line !py-2.5 px-4",
      className
    )}
    variant="secondaryGrey"
    size="sm"
    aria-label="Go to previous page"
    {...props}
  >
    <Icons.ArrowNarrowLeft className="h-5 w-5 stroke-semantic-fg-secondary" />
    <span className="product-body-text-3-semibold">Previous</span>
  </Button>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof Button>) => (
  <Button
    className={cn(
      "gap-x-2 rounded-l-none rounded-r-sm border-l-0 !border-semantic-bg-line !py-2.5 px-4",
      className
    )}
    variant="secondaryGrey"
    size="sm"
    aria-label="Go to next page"
    {...props}
  >
    <span className="product-body-text-3-semibold">Next</span>
    <Icons.ArrowNarrowRight className="h-5 w-5 stroke-semantic-fg-secondary" />
  </Button>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <Icons.DotsHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

const PaginationPageIndicator = ({
  className,
  currentPage,
  totalPages,
  ...props
}: React.ComponentProps<"div"> & {
  currentPage: number;
  totalPages: number;
}) => (
  <div
    className={cn("text-sm text-semantic-fg-disabled", className)}
    {...props}
  >
    {currentPage} of {totalPages}
  </div>
);
PaginationPageIndicator.displayName = "PaginationPageIndicator";

/* TODO:
 * Update the component to be able to render page links
 */

export const Pagination = {
  Root: PaginationRoot,
  Content: PaginationContent,
  Ellipsis: PaginationEllipsis,
  Item: PaginationItem,
  Next: PaginationNext,
  Prev: PaginationPrevious,
  PageIndicator: PaginationPageIndicator,
};
