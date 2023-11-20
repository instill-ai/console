import { Button, Icons, Select, Tag } from "@instill-ai/design-system";
import { Nullable } from "vitest";

export type MemberCardProps = {
  profileUrl?: Nullable<string>;
  memberName: Nullable<string>;
  memberRole: Nullable<string>;
};

export default function MemberCard({
  profileUrl,
  memberName,
  memberRole,
}: MemberCardProps) {
  return (
    <div className="mb-4 flex flex-row gap-x-3 rounded-sm border px-3 py-2">
      <div className="">
        <div className="my-auto flex h-14 w-14 cursor-pointer items-center justify-center rounded-lg bg-semantic-bg-secondary">
          {profileUrl ? (
            profileUrl
          ) : (
            <Icons.User02 className="h-7 w-7 stroke-slate-500" />
          )}
        </div>
      </div>
      <div className="w-1/2">
        <p className="mb-1 product-body-text-2-semibold">{memberName || ""}</p>
        <Tag size="sm">pinglin</Tag>
      </div>
      <div className="my-auto">
        <Select.Root>
          <Select.Trigger className="w-1/2">
            <Select.Value placeholder="Select a role" />
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              <Select.Label>Write</Select.Label>
              <Select.Item value="write">Write</Select.Item>
              <Select.Item value="read">Read</Select.Item>
              <Select.Item value="admin">admin</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>
      <div className="my-auto">
        <Button variant="tertiaryDanger" size="lg">
          Remove
        </Button>
      </div>
    </div>
  );
}
