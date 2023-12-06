import { LinkButton } from "@instill-ai/design-system";

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
