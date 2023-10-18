import cn from "clsx";
import { Nullable } from "../../lib";

export type TextCellProps = {
  width: Nullable<string>;
  padding: string;
  text: string;
};

export const TextCell = ({ text, width, padding }: TextCellProps) => {
  return (
    <td>
      <div className={cn("flex flex-row gap-x-2", width, padding)}>
        <p className="my-auto flex text-instillGrey90 text-instill-body">
          {text}
        </p>
      </div>
    </td>
  );
};
