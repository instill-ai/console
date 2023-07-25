import {
  TablePlaceholderBase,
  TablePlaceholderBaseProps,
} from "@instill-ai/toolkit";
import { PlaceholderSVG } from "./PlaceholderSVG";

export type BlockchainTablePlaceholderProps = Pick<
  TablePlaceholderBaseProps,
  "enableCreateButton" | "marginBottom"
>;

export const BlockchainTablePlaceholder = (
  props: BlockchainTablePlaceholderProps
) => {
  const { marginBottom, enableCreateButton } = props;

  return (
    <TablePlaceholderBase
      placeholderItems={[]}
      placeholderTitle="No model"
      createButtonTitle="Set up your first model"
      createButtonLink="/ais/create"
      marginBottom={marginBottom}
      enableCreateButton={enableCreateButton}
      svgElement={PlaceholderSVG()}
    />
  );
};
