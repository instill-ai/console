import { FC } from "react";

import {
  ConnectionTypeCell,
  DestinationTablePlaceholder,
  NameCell,
  SourceTableHead,
  TableBody,
  TableContainer,
  TableRow,
} from "@/components/ui";
import { Destination } from "@/lib/instill";

export type DestinationTableProps = {
  destinations: Destination[];
  isLoading: boolean;
};

const DestinationTable: FC<DestinationTableProps> = ({
  destinations,
  isLoading,
}) => {
  if (isLoading) {
    return <div>isLoading</div>;
  }

  if (destinations.length === 0) {
    return <DestinationTablePlaceholder />;
  }

  return (
    <TableContainer tableLayout="table-auto" borderCollapse="border-collapse">
      <SourceTableHead offlineCounts={1} onlineCounts={1} errorCounts={1} />
      <TableBody>
        {destinations.map((destination) => (
          <TableRow
            bgColor="bg-white"
            borderColor="border-instillGrey20"
            key={destination.id}
          >
            <NameCell
              name={destination.id}
              width="w-[234px]"
              state="STATE_ONLINE"
              updatedAt={destination.updateTime}
              paddingBottom="pb-5"
              paddingTop="pt-5"
              paddingLeft="pl-5"
              paddingRight=""
              link={`/sources/${destination.id}`}
            />
            <ConnectionTypeCell
              name={destination.id}
              type={destination.definition}
              cellType="shrink"
              width="w-[234px]"
              paddingBottom="pb-5"
              paddingTop="pt-5"
              paddingLeft=""
              paddingRight=""
            />
            {/* <InstanceCell
              width="w-80"
              type="pipeline"
              instances={destination.pipelines.map((e) => {
                return {
                  name: e.id,
                  state: e.state,
                };
              })}
              paddingBottom="pb-5"
              paddingTop="pt-5"
              paddingLeft=""
              paddingRight="pr-[15px]"
            /> */}
          </TableRow>
        ))}
      </TableBody>
    </TableContainer>
  );
};

export default DestinationTable;
