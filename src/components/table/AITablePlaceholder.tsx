import { Logos } from "@instill-ai/design-system";
import {
  TablePlaceholderBase,
  TablePlaceholderBaseProps,
} from "./TablePlaceholderBase";

export type AITablePlaceholderProps = Pick<
  TablePlaceholderBaseProps,
  "enableCreateButton" | "marginBottom"
>;

export const AITablePlaceholder = (props: AITablePlaceholderProps) => {
  const { marginBottom, enableCreateButton } = props;

  const placeholderItems = [
    {
      id: "MDL-logo",
      item: <Logos.MDLSquare className="h-[136px] w-[136px]" />,
    },
    {
      id: "Numbers-logo",
      item: <Logos.Number className="h-[136px] w-[136px]" />,
    },
    {
      id: "OpenAI-logo",
      item: <Logos.OpenAI className="h-[136px] w-[136px]" />,
    },
    {
      id: "Huggingface-logo",
      item: <Logos.HuggingFace className="h-[136px] w-[136px]" />,
    },
    {
      id: "Langchain-logo",
      item: (
        <div className="flex h-[136px] w-[136px]">
          <p className="my-auto text-[64px]">🦜️🔗</p>
        </div>
      ),
    },
    {
      id: "model-optical-character-recognition",
      item: <Logos.StabilityAI className="h-[136px] w-[136px]" />,
    },
  ];

  return (
    <TablePlaceholderBase
      placeholderItems={placeholderItems}
      placeholderTitle="No model"
      createButtonTitle="Set up your first model"
      createButtonLink="/ais/create"
      marginBottom={marginBottom}
      enableCreateButton={enableCreateButton}
    />
  );
};
