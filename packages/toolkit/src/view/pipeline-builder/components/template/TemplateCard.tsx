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
        "flex relative group hover:opacity-50 flex-col gap-y-3 cursor-pointer rounded-[4px] bg-semantic-bg-primary hover:bg-semantic-accent-bg hover:border-semantic-accent-default border border-semantic-bg-line px-2 py-3",
        className
      )}
      onClick={onClick}
    >
      <div className="flex flex-row">
        {(
          template.recipe.components.filter(
            (component) =>
              component.type === "COMPONENT_TYPE_CONNECTOR_AI" ||
              component.type === "COMPONENT_TYPE_CONNECTOR_BLOCKCHAIN" ||
              component.type === "COMPONENT_TYPE_CONNECTOR_DATA"
          ) as PipelineConnectorComponent[]
        ).map((component, idx) => (
          <div
            key={component.id}
            className={cn(
              "rounded-full flex justify-center items-center bg-semantic-bg-primary border border-semantic-bg-line shadow-xxs flex-shrink-0 max-w-[24px] max-h-[24px] w-6 h-6",
              idx !== 0 ? "-translate-x-2" : ""
            )}
          >
            <ImageWithFallback
              src={`/icons/${component.connector_definition?.vendor}/${component.connector_definition?.icon}`}
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
        <p className="product-body-text-4-semibold text-semantic-fg-primary">
          {template.id}
        </p>
        <p className="line-clamp-2 product-body-text-4-regular text-semantic-fg-secondary">
          {template.description}
        </p>
      </div>
      {/* <div className="flex flex-row gap-x-2">
        <Logo variant="colourLogomark" width={20} />
        <p className="my-auto product-body-text-4-medium text-semantic-fg-disabled">
          Instill AI
        </p>
      </div> */}
      <div className="hidden group-hover:flex absolute z-10 inset-0 justify-center items-center">
        <Tag variant="darkBlue" size="lg">
          use template
        </Tag>
      </div>
    </div>
  );
};
