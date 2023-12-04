import { Button, ComplicateIcons, Icons } from "@instill-ai/design-system";
import { useRouter } from "next/router";

export const Head = () => {
  const router = useRouter();
  const { id, entity } = router.query;

  return (
    <div className="flex flex-row">
      <div className="mr-auto flex flex-row gap-x-1 px-8 py-2">
        <Icons.Pipeline className="h-5 w-5 stroke-semantic-accent-default" />
        <p className="text-semantic-accent-default product-body-text-3-semibold">
          {entity}
        </p>
        <svg
          width="21"
          height="20"
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.45117 18.3337L14.7845 1.66699"
            stroke="#1D2433"
            strokeOpacity="0.65"
            strokeWidth="1.5"
            strokeLinecap="round"
            stroke-Linejoin="round"
          />
        </svg>
        <p className="text-semantic-fg-primary product-body-text-2-regular">
          {id}
        </p>
      </div>
      <div className="flex flex-row gap-x-4">
        <Button variant="secondaryGrey" size="lg">
          Cancel
        </Button>
        <Button variant="primary" size="lg">
          Publish Pipeline
        </Button>
      </div>
    </div>
  );
};
