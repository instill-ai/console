import cn from "clsx";
import { PipelineTemplate } from "../../type";
import { ImageWithFallback } from "../../../../components";
import { PipelineConnectorComponent } from "../../../../lib";
import { Icons, Tag } from "@instill-ai/design-system";

export type TemplateCardProps = {
  className?: string;
  onClick?: () => void;
  template: PipelineTemplate;
};

export const TemplateCard = (props: TemplateCardProps) => {
  const { className, onClick, template } = props;

  return (
    <div
      className={cn(
        "group relative flex cursor-pointer flex-col gap-y-3 rounded-[4px] border border-semantic-bg-line bg-semantic-bg-primary px-2 py-3 hover:border-semantic-accent-default hover:bg-semantic-accent-bg hover:opacity-50",
        className
      )}
      onClick={onClick}
    >
      <div className="flex flex-row">
        {(
          template.recipe.components.filter(
            (component) =>
              component.type === "COMPONENT_TYPE_CONNECTOR_AI" ||
              component.type === "COMPONENT_TYPE_CONNECTOR_APPLICATION" ||
              component.type === "COMPONENT_TYPE_CONNECTOR_DATA"
          ) as PipelineConnectorComponent[]
        ).map((component, idx) => (
          <div
            key={component.id}
            className={cn(
              "flex h-6 max-h-[24px] w-6 max-w-[24px] flex-shrink-0 items-center justify-center rounded-full border border-semantic-bg-line bg-semantic-bg-primary shadow-xxs",
              idx !== 0 ? "-translate-x-2" : ""
            )}
          >
            <ImageWithFallback
              src={`/icons/${component.connector_definition?.id}.svg`}
              width={12}
              height={12}
              alt={`${component.connector_definition?.title}-icon`}
              fallbackImg={
                <Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />
              }
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-y-1">
        <p className="text-semantic-fg-primary product-body-text-4-semibold">
          {template.id}
        </p>
        <p className="line-clamp-2 text-semantic-fg-secondary product-body-text-4-regular">
          {template.description}
        </p>
      </div>
      {/* <div className="flex flex-row gap-x-2">
        <Logo variant="colourLogomark" width={20} />
        <p className="my-auto product-body-text-4-medium text-semantic-fg-disabled">
          Instill AI
        </p>
      </div> */}
      <div className="absolute inset-0 z-10 hidden items-center justify-center group-hover:flex">
        <Tag variant="darkBlue" size="lg">
          use template
        </Tag>
      </div>
    </div>
  );
};
