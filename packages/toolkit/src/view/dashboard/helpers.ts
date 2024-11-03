export const columns = [
  {
    accessorKey: "pipelineId",
    header: "Pipeline ID",
  },
  {
    accessorKey: "runId",
    header: "Run ID",
  },
  {
    accessorKey: "version",
    header: "Version",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "source",
    header: "Source",
  },
  {
    accessorKey: "totalDuration",
    header: "Total Duration",
  },
  {
    accessorKey: "triggerTime",
    header: "Trigger Time",
  },
  {
    accessorKey: "runner",
    header: "Runner",
  },
  {
    accessorKey: "credit",
    header: "Credit",
  },
  {
    accessorKey: "creditOwner",
    header: "Credit Owner",
  },
];

export const formatDateToRFC3339 = (date: Date) => {
  return date.toISOString().split(".")[0] + ".000Z";
};

export const getStartOfDay = (date: Date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return formatDateToRFC3339(newDate);
};
