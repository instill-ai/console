import { Tag } from "@instill-ai/design-system";

type StatusTagProps = {
    status: string;
};

type FileStatus =
    | "NOTSTARTED"
    | "WAITING"
    | "CONVERTING"
    | "CHUNKING"
    | "EMBEDDING"
    | "COMPLETED"
    | "FAILED";

type TagVariant =
    | "lightNeutral"
    | "lightYellow"
    | "default"
    | "lightGreen"
    | "lightRed";

const getStatusTag = (
    status: FileStatus,
): { variant: TagVariant; dotColor: string } => {
    const statusMap: Record<
        FileStatus,
        { variant: TagVariant; dotColor: string }
    > = {
        NOTSTARTED: {
            variant: "lightNeutral",
            dotColor: "bg-semantic-fg-secondary",
        },
        WAITING: {
            variant: "lightYellow",
            dotColor: "bg-semantic-warning-default",
        },
        CONVERTING: { variant: "default", dotColor: "bg-semantic-accent-default" },
        CHUNKING: { variant: "default", dotColor: "bg-semantic-accent-default" },
        EMBEDDING: { variant: "default", dotColor: "bg-semantic-accent-default" },
        COMPLETED: {
            variant: "lightGreen",
            dotColor: "bg-semantic-success-default",
        },
        FAILED: { variant: "lightRed", dotColor: "bg-semantic-error-default" },
    };
    return statusMap[status as FileStatus] || statusMap.NOTSTARTED;
};

const formatStatus = (status: string): string => {
    if (status.toLowerCase() === "notstarted") {
        return "Not Started";
    }
    return status.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
};

export const StatusTag = ({ status }: StatusTagProps) => {
    const { variant, dotColor } = getStatusTag(
        status.toUpperCase() as FileStatus,
    );

    return (
        <Tag size="sm" variant={variant} className="relative group capitalize">
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${dotColor}`}></div>
                {formatStatus(status)}
            </div>
        </Tag>
    );
};
