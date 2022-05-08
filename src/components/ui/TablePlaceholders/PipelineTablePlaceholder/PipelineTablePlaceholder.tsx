import { FC } from "react";
import TablePlaceholderBase from "../TablePlaceholderBase";

const PipelineTablePlaceholder: FC = () => {
  return (
    <TablePlaceholderBase
      placeholderImage={
        <div className="flex h-[300px] w-full">placeholder</div>
      }
      createButtonLink="/pipeline/create"
    />
  );
};

export default PipelineTablePlaceholder;
