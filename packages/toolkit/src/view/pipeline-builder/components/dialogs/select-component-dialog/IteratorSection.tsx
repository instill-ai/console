import { Icons } from "@instill-ai/design-system";
import { ImageWithFallback } from "../../../../../components";
import { DialogSection } from "./DialogSection";
import { OnSelectComponent } from "./SelectComponentDialog";

export const IteratorSection = ({
  onSelect,
}: {
  onSelect: OnSelectComponent;
}) => {
  return (
    <DialogSection.Root title="Operators">
      <DialogSection.Grid>
        <DialogSection.Item
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
        </DialogSection.Item>
      </DialogSection.Grid>
    </DialogSection.Root>
  );
};
