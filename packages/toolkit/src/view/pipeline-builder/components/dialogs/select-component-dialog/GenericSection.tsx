import { Icons } from "@instill-ai/design-system";
import { ImageWithFallback } from "../../../../../components";
import { Section } from "./Section";
import { OnSelectComponent } from "./SelectComponentDialog";

export const GenericSection = ({
  onSelect,
}: {
  onSelect: OnSelectComponent;
}) => {
  return (
    <Section.Root title="Generic">
      <Section.Item
        onClick={() => {
          onSelect({
            id: "iterator",
            title: "Iterator",
            icon: "iterator.svg",
            name: "iterator/iterator",
            uid: "uid",
          });
        }}
      >
        <ImageWithFallback
          src="/icons/iterator.svg"
          width={32}
          height={32}
          alt="iterator-icon"
          fallbackImg={
            <Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />
          }
        />
        <p className="my-auto text-left text-semantic-fg-primary product-headings-heading-5">
          Iterator
        </p>
      </Section.Item>
    </Section.Root>
  );
};
