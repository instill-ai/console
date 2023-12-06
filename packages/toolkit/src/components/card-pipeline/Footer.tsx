import { Button, Icons, Separator, Tag } from "@instill-ai/design-system";

export const FooterSkeleton = () => {
  return (
    <div className="flex flex-col px-6 pb-4">
      <div className="flex flex-row">
        <div className="h-5 w-20 shrink-0 grow-0 animate-pulse rounded bg-semantic-bg-secondary"></div>
      </div>
      <Separator orientation="horizontal" className="my-2" />
      <div className="flex flex-row-reverse">
        <div className="h-10 w-[100px] shrink-0 grow-0 animate-pulse rounded bg-semantic-bg-secondary"></div>
      </div>
    </div>
  );
};

export const Footer = ({
  isOwner,
  pipelineLatestVersion,
}: {
  isOwner: boolean;
  pipelineLatestVersion: string;
}) => {
  return (
    <div className="flex flex-col px-6 pb-4">
      <div className="flex flex-row">
        <Tag variant="darkBlue" size="sm">
          {pipelineLatestVersion}
        </Tag>
      </div>
      <Separator orientation="horizontal" className="my-2" />
      <div className="flex flex-row-reverse">
        <Button
          className="flex flex-row gap-x-2"
          variant="tertiaryGrey"
          size="lg"
        >
          {isOwner ? (
            <>
              <Icons.Edit03 className="h-4 w-4 stroke-semantic-fg-secondary" />
              Edit
            </>
          ) : (
            <>
              <Icons.Copy07 className="h-4 w-4 stroke-semantic-fg-secondary" />
              Clone
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
Footer.Skeleton = FooterSkeleton;
