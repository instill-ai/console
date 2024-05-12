import { Button, Skeleton } from "@instill-ai/design-system";
import {
  InstillStore,
  useAppEntity,
  useInstillStore,
  useRemainingCredit,
  useShallow,
} from "../../../lib";
import { useRouter } from "next/navigation";
import { env } from "../../../server";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const RemainingCreditCTA = ({
  ctaTargetHref,
}: {
  ctaTargetHref: string;
}) => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const router = useRouter();
  const entity = useAppEntity();

  const remainingCredit = useRemainingCredit({
    ownerName: entity.data.entityName,
    accessToken,
    enabled:
      enabledQuery &&
      entity.isSuccess &&
      env("NEXT_PUBLIC_APP_ENV") === "CLOUD",
  });

  return (
    <div className="flex w-[232px] flex-row gap-x-2 rounded-sm border border-semantic-bg-line bg-semantic-bg-primary p-2">
      {remainingCredit.isSuccess ? (
        <p className=" font-mono text-[11px] font-medium text-[#344054]">{`${remainingCredit.data}`}</p>
      ) : (
        <Skeleton className="my-auto h-5 w-[100px] rounded" />
      )}
      <Button
        variant="primary"
        onClick={() => {
          router.push(ctaTargetHref);
        }}
        className="ml-auto"
        size="md"
      >
        Upgrade
      </Button>
    </div>
  );
};
