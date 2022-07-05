import { FC } from "react";
import TableHeadBase from "../TableHeadBase";

// export type ModelTableHeadProps = {};

const ModelTableHead: FC = () => {
  const ModelHeadItem = [
    {
      key: "model-name",
      item: <></>,
    },
    {
      key: "model-source-head",
      item: "Source",
    },
    {
      key: "model-instances-head",
      item: "Instances",
    },
  ];

  return (
    <TableHeadBase
      borderColor="border-instillGrey20"
      bgColor="bg-instillGrey05"
      items={ModelHeadItem}
    />
  );
};

export default ModelTableHead;
