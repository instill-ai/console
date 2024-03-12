"use client";

import cn from "clsx";
import { NoBgSquareProgress } from "@instill-ai/design-system";

import { Nullable } from "../lib";

export type TableLoadingProgressProps = {
  marginBottom: Nullable<string>;
};

export const TableLoadingProgress = ({
  marginBottom,
}: TableLoadingProgressProps) => {
  return (
    <div
      className={cn(
        "border-instillGrey20 flex min-h-[300px] w-full border bg-white",
        marginBottom
      )}
    >
      <div className="m-auto flex flex-col gap-y-2.5">
        <div className="bg-instillBlue10 m-auto flex h-[72px] w-[72px]">
          <NoBgSquareProgress
            isLoading={true}
            blockSize={52}
            position="m-auto"
          />
        </div>
        <p className="text-instillGrey50 text-instill-small mx-auto">
          loading...
        </p>
      </div>
    </div>
  );
};
