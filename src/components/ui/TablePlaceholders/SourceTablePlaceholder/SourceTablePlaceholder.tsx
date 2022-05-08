import { FC } from "react";
import TablePlaceholderBase from "../TablePlaceholderBase";

const SourceTablePlaceholder: FC = () => {
  return (
    <TablePlaceholderBase
      placeholder={<div className="flex h-[300px] w-full">placeholder</div>}
      createButtonLink="/data-cource/create"
    />
  );
};

export default SourceTablePlaceholder;
