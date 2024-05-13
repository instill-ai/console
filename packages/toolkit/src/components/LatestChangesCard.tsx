import { Icons } from "@instill-ai/design-system";

const LatestChangesCard = () => (
  <div className="mt-4 flex flex-col gap-y-2 rounded-sm border border-semantic-bg-line p-2">
    <h2 className="text-2xl font-bold mb-4">Latest Changes</h2>
    <button
      type="button"
      className="my-auto text-semantic-accent-default product-button-button-2 hover:!underline bg-blue-100 rounded-sm p-2 w-2/3 capitalize"
    >
      April 24, 2024
    </button>
    <p>Introducing Secret Management for Connector Configuration</p>
    <button
      type="button"
      className="my-auto  text-semantic-accent-default product-button-button-2 hover:!underline bg-blue-100 rounded-sm p-2 w-2/3 capitalize"
    >
      April 24, 2024
    </button>
    <p>Introducing Secret Management for Connector Configuration</p>
    <a href="https://instill-ai.productlane.com/changelog" target="_blank" rel="noopener noreferrer">
      <button
        type="button"
        className="my-auto text-semantic-accent-default product-button-button-2 hover:!underline flex justify-start mt-4"
      >
        View changelog
        <Icons.ChevronRight className="my-auto h-4 w-4 stroke-semantic-accent-default" />
      </button>
    </a>
  </div>
);

export default LatestChangesCard;
