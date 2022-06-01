import { FC } from "react";
import cn from "clsx";
import { NoBgSquareProgress } from "@instill-ai/design-system";

import { Nullable } from "@/types/general";

export type TableLoadingPlaceholderProps = {
  marginBottom: Nullable<string>;
};

const TableLoadingPlaceholder: FC<TableLoadingPlaceholderProps> = ({
  marginBottom,
}) => {
  return (
    <div className={cn("flex h-[300px] w-full bg-white", marginBottom)}>
      <div className="m-auto flex flex-col gap-y-2.5">
        <div className="m-auto flex h-[72px] w-[72px] bg-instillBlue10">
          <NoBgSquareProgress
            isLoading={true}
            blockSize={52}
            position="m-auto"
          />
        </div>
        <p className="instill-text-small mx-auto text-instillGrey50">
          loading...
        </p>
      </div>
    </div>
  );
};

export default TableLoadingPlaceholder;
