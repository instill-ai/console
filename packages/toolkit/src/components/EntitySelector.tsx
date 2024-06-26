import { Select, Tag } from "@instill-ai/design-system";

import { UserNamespace } from "../lib/useUserNamespaces";
import { NamespaceAvatarWithFallback } from "./NamespaceAvatarWithFallback";

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
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  data: UserNamespace[];
  placeholder?: string;
}) => {
  const selectedNamespace = data.find((namespace) => namespace.id === value);

  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger className="w-full">
        <Select.Value placeholder={placeholder ?? "Select Owner"}>
          {selectedNamespace ? (
            <div className="flex">
              <Tag
                size="md"
                variant="lightNeutral"
                className="gap-x-1 border-0 !px-1.5 !font-semibold !text-semantic-fg-primary"
              >
                <NamespaceAvatarWithFallback.Root
                  src={selectedNamespace.avatarUrl}
                  className="h-4 w-4"
                  fallback={
                    <NamespaceAvatarWithFallback.Fallback
                      namespaceId={selectedNamespace.id}
                      displayName={selectedNamespace.displayName}
                      className="flex h-4 w-4"
                    />
                  }
                />

                {truncateDisplayName(selectedNamespace?.id)}
              </Tag>
            </div>
          ) : null}
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
                    className="gap-x-1 whitespace-nowrap border-0 !px-1.5 !font-semibold !text-semantic-fg-primary"
                  >
                    <NamespaceAvatarWithFallback.Root
                      src={namespace.avatarUrl}
                      className="h-4 w-4"
                      fallback={
                        <NamespaceAvatarWithFallback.Fallback
                          namespaceId={namespace.id}
                          displayName={namespace.displayName}
                          className="flex h-4 w-4"
                        />
                      }
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
