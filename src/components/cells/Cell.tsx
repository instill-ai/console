import { Nullable } from "@instill-ai/toolkit";
import cn from "clsx";
import Link from "next/link";

export type CellProps = {
  width: Nullable<string>;
  name: string | number | undefined;
  padding: string;
  link?: string;
};

export const Cell = ({ width, name, padding, link }: CellProps) => {
  return (
    <td>
      <div className={cn("flex flex-row gap-x-2", width, padding)}>
        {link ? (
          <Link className="w-4/5" href={link}>
            <h3 className="truncate text-instill-h3 hover:underline">{name}</h3>
          </Link>
        ) : (
          <h3 className="truncate text-instill-h3 hover:underline">{name}</h3>
        )}
      </div>
    </td>
  );
};
