import { FC } from "react";
import { Source } from "./SourceServices";

import {
  ConnectionTypeCell,
  InstanceCell,
  NameCell,
  SourceTableHead,
  SourceTablePlaceholder,
  TableBody,
  TableContainer,
  TableRow,
} from "@/components/ui";

export type SourceTableProps = {
  sources: Source[];
  isLoadingSources: boolean;
};

const SourceTable: FC<SourceTableProps> = ({ sources, isLoadingSources }) => {
  if (isLoadingSources) {
    return <div>isLoading</div>;
  }

  if (sources.length === 0) {
    return <SourceTablePlaceholder />;
  }

  return (
    <TableContainer tableLayout="table-auto" borderCollapse="border-collapse">
      <SourceTableHead offlineCounts={1} onlineCounts={1} errorCounts={1} />
      <TableBody>
        {sources.map((source) => (
          <TableRow
            bgColor="bg-white"
            borderColor="border-instillGrey20"
            key={source.name}
          >
            <NameCell
              name={source.name}
              width="w-[234px]"
              status="online"
              updatedAt={source.update_time}
              paddingBottom="pb-5"
              paddingTop="pt-5"
              paddingLeft="pl-5"
              paddingRight=""
            />
            <ConnectionTypeCell
              name={source.type}
              type={source.type}
              cellType="shrink"
              width="w-[234px]"
              paddingBottom="pb-5"
              paddingTop="pt-5"
              paddingLeft=""
              paddingRight=""
            />
            <InstanceCell
              width="w-80"
              type="pipeline"
              instances={source.pipelines.map((e) => {
                return {
                  name: e.id,
                  status: e.status,
                };
              })}
              paddingBottom="pb-5"
              paddingTop="pt-5"
              paddingLeft=""
              paddingRight="pr-[15px]"
            />
          </TableRow>
        ))}
      </TableBody>
    </TableContainer>
  );
};

export default SourceTable;
