import { FC } from "react";
import cn from "clsx";

export type ModelInstanceReadmeCardProps = {
  marginBottom: string;
};

const ModelInstanceReadmeCard: FC<ModelInstanceReadmeCardProps> = ({
  marginBottom,
}) => {
  return (
    <div
      className={cn(
        "flex min-h-[200px] w-full flex-col border border-instillGrey20 bg-white",
        marginBottom
      )}
    >
      <h3 className="mx-auto mt-auto text-instillGrey90 text-instill-h3">
        There is no Model card
      </h3>
      <p className="mx-auto mb-auto text-instillGrey50 text-instill-body">
        You can add a README.md to discribe the model.
      </p>
    </div>
  );
};

export default ModelInstanceReadmeCard;
