import { Icons } from "@instill-ai/design-system";
import { ImageWithFallback } from "./ImageWithFallback";

const NewsLetterCard = () => (
  <div className="flex flex-col gap-y-2 rounded-sm border border-semantic-bg-line p-2">
    <h2 className="text-2xl font-bold mb-4">What's New?</h2>
    <ImageWithFallback
      src={`https://placehold.co/600x400`}
      width={32}
      height={32}
      alt={`test-icon`}
      fallbackImg={<Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />}
    />
    <button
      type="button"
      className="my-auto capitalize text-semantic-accent-default product-button-button-2 hover:!underline bg-blue-100 rounded-sm p-2 w-1/3"
    >
      Tag
    </button>
    <p>May 2024: Dive in AI Building with Instill AI's Hackathon and Local Workshop</p>
  </div>
);

export default NewsLetterCard;
