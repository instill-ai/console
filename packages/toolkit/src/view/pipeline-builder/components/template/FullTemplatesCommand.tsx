import * as React from "react";
import { Command, Icons } from "@instill-ai/design-system";
import { PipelineTemplate, PipelineTemplatesByCategory } from "../../type";
import { TemplateCard } from "./TemplateCard";

export type FullTemplatesCommandProps = {
  templatesByCategory: PipelineTemplatesByCategory;
  onSelectTemplate: (template: PipelineTemplate) => void;
};

export const FullTemplatesCommand = ({
  templatesByCategory,
  onSelectTemplate,
}: FullTemplatesCommandProps) => {
  const [open, setOpen] = React.useState(false);
  const [isHoverOnTrigger, setIsHoverOnTrigger] = React.useState(false);

  return (
    <React.Fragment>
      <button
        onClick={() => {
          setOpen(true);
        }}
        className="group relative h-[124px] w-[204px] cursor-pointer"
        onMouseEnter={() => {
          setIsHoverOnTrigger(true);
        }}
        onMouseLeave={() => {
          setIsHoverOnTrigger(false);
        }}
      >
        <svg
          width="204"
          height="124"
          viewBox="0 0 204 124"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_2122_42233)">
            <rect width="204" height="124" rx="8" fill="white" />
            <g clipPath="url(#clip1_2122_42233)">
              <rect width="204" height="124" fill="white" />
              <rect
                x="-115.758"
                y="61.0111"
                width="327.532"
                height="82.989"
                transform={
                  isHoverOnTrigger
                    ? "rotate(-45 -115.758 61.0111) translate(0, -20)"
                    : "rotate(-45 -115.758 61.0111)"
                }
                fill="#FEE1E3"
                className="transition-transform"
              />
              <rect
                x="-57.0756"
                y="119.693"
                width="327.532"
                height="82.989"
                transform={
                  isHoverOnTrigger
                    ? "rotate(-45 -57.0756 119.693) translate(0, -20)"
                    : "rotate(-45 -57.0756 119.693)"
                }
                fill="#E02E3D"
                className="transition-transform"
              />
              <rect
                x="-3.75391"
                y="173.014"
                width="327.532"
                height="174.189"
                transform={
                  isHoverOnTrigger
                    ? "rotate(-45 -3.75391 173.014) translate(0, -20)"
                    : "rotate(-45 -3.75391 173.014)"
                }
                fill="#6E35DE"
                className="transition-transform"
              />
            </g>
          </g>
          <rect
            x="0.243325"
            y="0.243325"
            width="203.513"
            height="123.513"
            rx="7.75667"
            stroke="#E1E6EF"
            strokeWidth="0.486651"
          />
          <defs>
            <clipPath id="clip0_2122_42233">
              <rect width="204" height="124" rx="8" fill="white" />
            </clipPath>
            <clipPath id="clip1_2122_42233">
              <rect width="204" height="124" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <div className="absolute bottom-0 right-0 flex flex-row gap-x-2 px-3 py-[9px] transition-transform group-hover:-translate-y-5">
          <p className="text-semantic-bg-primary product-button-button-2">
            All Templates
          </p>
          <Icons.ArrowNarrowRight className="h-[14px] w-[14px] stroke-semantic-bg-primary" />
        </div>
      </button>
      <Command.Dialog
        dialogContentClassName="!w-[750px]"
        open={open}
        onOpenChange={setOpen}
      >
        <Command.Input
          startIcon={
            <Icons.SearchSm className="h-4 w-4 stroke-semantic-bg-line" />
          }
          placeholder="Search Template..."
        />
        <Command.List className="w-[750px] !max-w-none">
          <Command.Empty>No results found.</Command.Empty>
          {Object.keys(templatesByCategory).map((category) => (
            <React.Fragment key={category}>
              <Command.Group className="!w-full" heading={category}>
                <div className="grid w-full grid-cols-3 gap-x-6 gap-y-4">
                  {templatesByCategory[category].map((template) => (
                    <Command.Item
                      key={template.id}
                      onSelect={() => {
                        onSelectTemplate(template);
                      }}
                    >
                      <TemplateCard
                        key={template.id}
                        template={template}
                        className="w-[215px]"
                      />
                    </Command.Item>
                  ))}
                </div>
              </Command.Group>
              <Command.Separator />
            </React.Fragment>
          ))}
        </Command.List>
      </Command.Dialog>
    </React.Fragment>
  );
};
