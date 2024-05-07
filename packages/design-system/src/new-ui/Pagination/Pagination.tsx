import { Button } from "../Button";
import { Icons } from "../Icons";
import cn from "clsx";

export type PaginationProps = {
  align?: 'left' | 'right' | 'center';
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export const Pagination = (props: PaginationProps) => {
  const { align = 'center', isPrevDisabled, isNextDisabled, currentPage, totalPages, onPrev, onNext } = props;

  return (
    <div className="flex items-center justify-between py-4">
      <Button
        className={cn("gap-x-2 rounded-l-sm !border-semantic-bg-line !py-2.5 px-4", align !== 'center' ? "!rounded-r-none" : "rounded-r-sm", align === 'right' ? 'ml-auto' : null)}
        variant="secondaryGrey"
        size="sm"
        onClick={onPrev}
        disabled={isPrevDisabled}
      >
        <Icons.ArrowNarrowLeft className="h-5 w-5 stroke-semantic-fg-secondary" />
        <span className="product-body-text-3-semibold">Previous</span>
      </Button>
      {
        totalPages > 1
          ? (
            <div className={cn("text-sm text-semantic-fg-disabled", align === 'left' ? "order-last" : null, align === 'right' ? "order-first" : null)}>
              {currentPage} of {totalPages}
            </div>
          ) : null
      }
      <Button
        className={cn("gap-x-2 rounded-r-sm !border-semantic-bg-line !py-2.5 px-4", align !== 'center' ? "!rounded-l-none border-l-0" : "rounded-l-sm", align === 'left' ? 'mr-auto' : null)}
        variant="secondaryGrey"
        size="sm"
        onClick={onNext}
        disabled={isNextDisabled}
      >
        <span className="product-body-text-3-semibold">Next</span>
        <Icons.ArrowNarrowRight className="h-5 w-5 stroke-semantic-fg-secondary" />
      </Button>
    </div>
  );
}