import { Icons, Nullable, Select, Tag } from "@instill-ai/design-system";
import { EntityAvatar } from "./EntityAvatar";

export type OwnerEntity = {
  id: string;
  name: string;
  type: "user" | "organization";
  avatarUrl: Nullable<string>;
};

export type EntitySelectorProps = {
  value: string;
  onChange: (value: string) => void;
  data: OwnerEntity[];
};

const truncateDisplayName = (value?: string) => {
  if (value && value.length >= 10) {
    return `${value?.slice(0, 10)}...`;
  }

  return value;
};

export const EntitySelector = ({
  value,
  onChange,
  data,
}: EntitySelectorProps) => {
  const selectedEntity = data.find((namespace) => namespace.id === value);

  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger className="w-full">
        <Select.Value placeholder="Select Model Owner">
          <div className="flex flex-row gap-x-2">
            <Tag
              size="md"
              variant="lightNeutral"
              className="border-0 !px-1.5 !font-semibold !text-semantic-fg-primary"
            >
              <EntityAvatar
                src={selectedEntity?.avatarUrl || null}
                className="mr-1 h-4 w-4 rounded-full"
                fallbackImg={
                  <div className="mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-semantic-bg-line">
                    <Icons.User02 className="h-3 w-3 stroke-semantic-fg-secondary" />
                  </div>
                }
                entityName={selectedEntity?.id || ""}
              />
              {truncateDisplayName(selectedEntity?.id)}
            </Tag>
          </div>
        </Select.Value>
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          {data.length &&
            data.map((namespace) => (
              <Select.Item value={namespace.id} key={namespace.id}>
                <Select.ItemText>
                  <Tag
                    size="md"
                    variant="lightNeutral"
                    className="whitespace-nowrap border-0 !px-1.5 !font-semibold !text-semantic-fg-primary"
                  >
                    <EntityAvatar
                      src={namespace.avatarUrl}
                      className="mr-1 h-4 w-4 rounded-full"
                      fallbackImg={
                        <div className="mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-semantic-bg-line">
                          <Icons.User02 className="h-3 w-3 stroke-semantic-fg-secondary" />
                        </div>
                      }
                      entityName={namespace.id}
                    />
                    {truncateDisplayName(namespace.id)}
                  </Tag>
                </Select.ItemText>
              </Select.Item>
            ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};
