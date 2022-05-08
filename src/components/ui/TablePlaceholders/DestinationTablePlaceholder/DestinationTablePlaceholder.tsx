import { FC } from "react";
import TablePlaceholderBase from "../TablePlaceholderBase";

const DestinationTablePlaceholder: FC = () => {
  return (
    <TablePlaceholderBase
      placeholder={<div className="flex h-[300px] w-full">placeholder</div>}
      createButtonLink="/data-destination/create"
    />
  );
};

export default DestinationTablePlaceholder;
