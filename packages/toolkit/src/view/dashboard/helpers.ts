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

export const mockTableData = [
    {
        pipelineId: "pipeline1",
        runId: "run1",
        version: "1.0.0",
        status: "COMPLETED",
        source: "API",
        totalDuration: "2h 30m",
        triggerTime: "2023-09-19 10:00:00",
        runner: "Runner1",
        credit: 100,
        creditOwner: "User1",
    },
    {
        pipelineId: "pipeline2",
        runId: "run2",
        version: "2.1.0",
        status: "FAILED",
        source: "Scheduler",
        totalDuration: "1h 45m",
        triggerTime: "2023-09-19 11:30:00",
        runner: "Runner2",
        credit: 75,
        creditOwner: "User2",
    },
    {
        pipelineId: "pipeline3",
        runId: "run3",
        version: "1.5.0",
        status: "COMPLETED",
        source: "Manual",
        totalDuration: "3h 15m",
        triggerTime: "2023-09-19 13:00:00",
        runner: "Runner3",
        credit: 150,
        creditOwner: "User3",
    },
];