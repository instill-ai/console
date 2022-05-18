import { FC } from "react";
import TablePlaceholderBase from "../TablePlaceholderBase";

const PipelineTablePlaceholder: FC = () => {
  const placeholderItems = [
    {
      id: "",
      item: <div></div>,
    },
  ];

  return (
    <TablePlaceholderBase
      placeholderItems={placeholderItems}
      placeholderTitle="No pipeline"
      createButtonLink="/pipeline/create"
      createButtonTitle="Create your first pipeline"
    />
  );
};

export default PipelineTablePlaceholder;
