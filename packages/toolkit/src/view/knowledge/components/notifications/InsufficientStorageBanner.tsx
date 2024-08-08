import { Button, Icons, LinkButton } from "@instill-ai/design-system";
import { Nullable } from "instill-sdk";
import { useRouter } from "next/navigation";

type InsufficientStorageBannerProps = {
    setshowStorageWarning: React.Dispatch<React.SetStateAction<boolean>>;
    selectedNamespace: Nullable<string>;
};

export const InsufficientStorageBanner = ({
    setshowStorageWarning,
    selectedNamespace,
}: InsufficientStorageBannerProps) => {
    const router = useRouter();

    return (
        <div className="mb-4 w-full bg-semantic-warning-bg p-4 flex justify-between">
            <div className="flex items-start">
                <Icons.AlertTriangle className="mr-4 h-6 w-6 stroke-semantic-warning-on-bg flex-shrink-0" />
                <div className="flex flex-col items-start justify-start">
                    <p className="text-semantic-fg-primary product-body-text-3-regular">
                        Storage is almost full. Once the storage is full, you won&apos;t be able to create, edit, or upload files.
                    </p>
                    <LinkButton
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                            router.push(`/${selectedNamespace}/subscribe`);
                        }}
                    >
                        Upgrade your plan for more storage space
                    </LinkButton>
                </div>
            </div>
            <Button
                variant="tertiaryGrey"
                size="sm"
                onClick={() => setshowStorageWarning(false)}
                className="ml-4 flex-shrink-0"
            >
                <Icons.X className="h-6 w-6 stroke-semantic-fg-secondary" />
            </Button>
        </div>
    );
};