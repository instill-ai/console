import cn from "clsx";
import { ConnectorResourceVisibility, Nullable } from "../../lib";

export type VisibilityCellProps = {
  width: Nullable<string>;
  visibility: ConnectorResourceVisibility;
  padding: string;
};

export const VisibilityCell = ({
  visibility,
  width,
  padding,
}: VisibilityCellProps) => {
  return (
    <td>
      <div className={cn("flex flex-row gap-x-2", width, padding)}>
        <p className="my-auto flex text-instillGrey90 text-instill-body">
          {visibility === "VISIBILITY_PRIVATE"
            ? "Private"
            : visibility === "VISIBILITY_PUBLIC"
            ? "Public"
            : "Unspecified"}
        </p>
      </div>
    </td>
  );
};
