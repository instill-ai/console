import { Button, Icons, LinkButton } from "@instill-ai/design-system";

type CreditUsageNotificationProps = {
  handleCloseCreditUsageMessage: () => void;
  fileName: string;
};

const CreditUsageNotification = ({
  handleCloseCreditUsageMessage,
}: CreditUsageNotificationProps) => {
  return (
    <div className="fixed bottom-4 right-8 flex w-[400px] rounded-sm border border-semantic-bg-line bg-semantic-bg-primary p-4 shadow">
      <Icons.AlertCircle className="mr-4 h-6 w-6 stroke-semantic-accent-on-bg" />
      <div className="mr-4 flex shrink grow basis-0 flex-col items-start justify-start gap-1 self-stretch">
        <div className="self-stretch product-body-text-2-semibold">
          Credit Usage Reminder
        </div>
        <div className="self-stretch text-semantic-fg-secondary product-body-text-3-regular mb-4">
          This action consumes credits. Check your remaining balance in the account settings.
        </div>
        <LinkButton>
          Check credits
        </LinkButton>
      </div>
      <Button
        className="absolute right-2 top-2"
        variant="tertiaryGrey"
        size="sm"
        onClick={handleCloseCreditUsageMessage}
      >
        <Icons.X className="h-6 w-6 stroke-semantic-fg-secondary" />
      </Button>
    </div>
  );
};

export default CreditUsageNotification;
