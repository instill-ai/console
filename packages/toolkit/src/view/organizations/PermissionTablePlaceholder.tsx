import {
  TablePlaceholderBase,
  type TablePlaceholderBaseProps,
} from "../../components";
import { Icons } from "@instill-ai/design-system";

export type PermissionTablePlaceholderProps = Pick<
  TablePlaceholderBaseProps,
  "marginBottom" | "enableCreateButton"
>;

export const PermissionTablePlaceholder = (
  props: PermissionTablePlaceholderProps
) => {
  const { marginBottom, enableCreateButton } = props;
  const width = "w-[136px]";
  const height = "h-[136px]";
  const color = "fill-instillGrey95";
  const position = "my-auto";
  const placeholderItems = [
    {
      id: "pipeline-placeholder-1",
      item: <Icons.User02 className="h-30 w-30 stroke-slate-500" />,
    },
  ];

  return (
    <TablePlaceholderBase
      placeholderItems={placeholderItems}
      placeholderTitle="No permission"
      createButtonLink="/pipelines/create"
      createButtonTitle="Set up your first pipeline"
      marginBottom={marginBottom}
      enableCreateButton={enableCreateButton}
    />
  );
};
