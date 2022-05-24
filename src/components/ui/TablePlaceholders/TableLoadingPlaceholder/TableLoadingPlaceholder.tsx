import { NoBgSquareProgress } from "@instill-ai/design-system";
import { FC } from "react";

const TableLoadingPlaceholder: FC = () => {
  return (
    <div className="flex h-[300px] w-full bg-white">
      <div className="m-auto flex flex-col gap-y-2.5">
        <div className="h-[72px] w-[72px] bg-instillBlue10">
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
