import { ModelTablePlaceholder } from "@/components/ui/TablePlaceholders";
import { Model } from "@/lib/instill";
import { FC } from "react";

export type ModelTableProps = {
  models: Model[];
  isLoading: boolean;
};

const ModelTable: FC<ModelTableProps> = ({ models, isLoading }) => {
  if (isLoading) {
    return <div>is loading</div>;
  }

  if (models.length === 0) {
    return <ModelTablePlaceholder />;
  }

  return <div></div>;
};

export default ModelTable;
