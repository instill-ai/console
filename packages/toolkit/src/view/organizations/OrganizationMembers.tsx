import {
  Button,
  Icons,
  Select,
  Separator,
  Switch,
  Tag,
} from "@instill-ai/design-system";
import { Nullable, useUser } from "../../lib";

export type OrganizationMembersProps = {
  accessToken: Nullable<string>;
  enableQuery: boolean;
};

export const OrganizationMembers = (props: OrganizationMembersProps) => {
  const { accessToken, enableQuery } = props;

  const user = useUser({
    enabled: enableQuery,
    accessToken,
  });

  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <div className="mb-5 flex flex-row">
          <p className="text-lg font-semibold leading-7 text-[#101828]">
            Members
          </p>
        </div>
        <div className="border-b border-b-[#EAECF0]" />
      </div>

      <div className="flex h-full w-full flex-col">
        <div className="w-full">
          <div className="flex flex-row">
            <div className="w-1/5">
              <p className="product-body-text-3-semibold">Join Settings</p>
            </div>
            <div className="w-4/5 space-y-8">
              <div className="flex w-full flex-row p-3">
                <div className="my-auto px-3">
                  <Switch />
                </div>
                <div className="my-auto px-3">
                  <p className="product-body-text-2-semibold">
                    Enable inviting users by sharing a link
                  </p>
                  <p className="text-semantic-fg-disabled product-body-text-2-regular">
                    Anyone with the link will be able ro join your org -
                    Toggling off and on will regenerate the link.
                  </p>
                </div>
                <div className="my-auto w-1/6 px-4">
                  <Button variant="secondaryGrey" size="md">
                    Email Link
                  </Button>
                </div>
              </div>
              <div className="flex w-full flex-row p-3">
                <div className="my-auto px-3">
                  <Switch checked={true} />
                </div>
                <div className="my-auto px-3">
                  <p className="product-body-text-2-semibold">
                    Allow request to join from the organisation page
                  </p>
                  <p className="text-semantic-fg-disabled product-body-text-2-regular">
                    A button will be visible on your org page allowing anyone to
                    request to join.
                  </p>
                </div>
                <div className="my-auto w-1/6 px-4"></div>
              </div>
              <div className="flex w-full flex-row p-3">
                <div className="my-auto px-3">
                  <Switch checked={true} />
                </div>
                <div className="my-auto px-3">
                  <p className="product-body-text-2-semibold">
                    Automatically approve join requests
                  </p>
                  <p className="text-semantic-fg-disabled product-body-text-2-regular">
                    For open organisations anyone will be able to join your org
                    without any approval.
                  </p>
                </div>
                <div className="my-auto w-1/6 px-4"></div>
              </div>

              <div className="w-full space-y-2">
                <p className="product-button-button-2">
                  Default Role for New Members
                </p>
                <div className="w-1/3">
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
                <p className="text-semantic-fg-disabled product-body-text-2-regular">
                  New members of the organisation will be assigned this role.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <Separator className="my-5" />
        </div>

        <div className="w-full space-y-8">
          <div>
            <p className="product-body-text-3-semibold">Organisation Members</p>
          </div>

          <div className="flex flex-row gap-x-4">
            <div className="flex w-1/2 flex-row gap-x-3 rounded-sm border px-3 py-2">
              <div className="">
                <div className="my-auto flex h-14 w-14 cursor-pointer items-center justify-center rounded-lg bg-semantic-bg-secondary">
                  <Icons.User02 className="h-7 w-7 stroke-slate-500" />
                </div>
              </div>
              <div className="w-1/2">
                <p className="product-body-text-2-semibold">Ping-Lin Chang</p>
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
            <div className="flex w-1/2 flex-row gap-x-3 rounded-sm border px-3 py-2">
              <div className="">
                <div className="my-auto flex h-14 w-14 cursor-pointer items-center justify-center rounded-lg bg-semantic-bg-secondary">
                  <Icons.User02 className="h-7 w-7 stroke-slate-500" />
                </div>
              </div>
              <div className="w-1/2">
                <p className="product-body-text-2-semibold">Ping-Lin Chang</p>
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
          </div>
        </div>
      </div>
    </div>
  );
};
