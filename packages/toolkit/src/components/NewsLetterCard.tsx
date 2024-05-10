import { Icons } from "@instill-ai/design-system";
import { ImageWithFallback } from "./ImageWithFallback";

const NewsLetterCard = () => (
  <div className="flex flex-col gap-y-2 rounded-sm border border-semantic-bg-line p-2">
    <h2 className="text-2xl font-bold">What's New?</h2>
    <ImageWithFallback
      src={`/icons/gcs.svg`}
      width={32}
      height={32}
      alt={`test-icon`}
      fallbackImg={<Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />}
    />
    <div className="inline-block rounded-sm bg-blue-500 px-2 py-1 font-bold text-white">
      Tag
    </div>
    <p>Text goes here</p>
  </div>
);

export default NewsLetterCard;
