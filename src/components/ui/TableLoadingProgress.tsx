import cn from "clsx";
import { NoBgSquareProgress } from "@instill-ai/design-system";

import { Nullable } from "@/types/general";

export type TableLoadingProgressProps = {
  marginBottom: Nullable<string>;
};

export const TableLoadingProgress = ({
  marginBottom,
}: TableLoadingProgressProps) => {
  return (
    <div className={cn("flex min-h-[300px] w-full bg-white", marginBottom)}>
      <div className="m-auto flex flex-col gap-y-2.5">
        <div className="m-auto flex h-[72px] w-[72px] bg-instillBlue10">
          <NoBgSquareProgress
            isLoading={true}
            blockSize={52}
            position="m-auto"
          />
        </div>
        <p className="mx-auto text-instillGrey50 text-instill-small">
          loading...
        </p>
      </div>
    </div>
  );
};
