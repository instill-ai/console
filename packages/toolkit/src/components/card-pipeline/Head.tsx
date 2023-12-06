import { LinkButton } from "@instill-ai/design-system";

export const HeadSkeleton = () => {
  return (
    <div className="flex w-full flex-row gap-x-2 p-3">
      <div className="my-auto h-8 w-8 shrink-0 grow-0 animate-pulse rounded-full bg-semantic-bg-secondary" />
      <div className="h-[38px] w-20 animate-pulse rounded bg-semantic-bg-secondary"></div>
    </div>
  );
};

export const Head = ({ ownerID }: { ownerID: string }) => {
  return (
    <div className="flex flex-row gap-x-2 p-3">
      <div className="my-auto h-8 w-8 shrink-0 grow-0 rounded-full bg-semantic-bg-line" />
      <LinkButton className="my-auto" size="md" variant="primary">
        {ownerID}
      </LinkButton>
    </div>
  );
};
Head.Skeleton = HeadSkeleton;
