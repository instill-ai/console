import * as React from "react";
import { Button, Icons, Popover, Tooltip } from "@instill-ai/design-system";
import { Nullable, PipelineComponentType } from "../../../../lib";

export const ConnectorNodeControlPanel = ({
	componentType,
	handleDeleteNode,
	handleCopyNode,
	handleEditNode,
	nodeIsCollapsed,
	setNodeIsCollapsed,
	testModeEnabled,
}: {
	componentType: PipelineComponentType;
	handleDeleteNode: () => void;
	handleCopyNode: () => void;
	handleEditNode: () => void;
	nodeIsCollapsed: boolean;
	setNodeIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
	testModeEnabled: boolean;
}) => {
	const [moreOptionsIsOpen, setMoreOptionsIsOpen] = React.useState(false);

	let componentTypeName: Nullable<string> = null;

	switch (componentType) {
		case "COMPONENT_TYPE_CONNECTOR_AI":
			componentTypeName = "AI Component";
			break;
		case "COMPONENT_TYPE_CONNECTOR_DATA":
			componentTypeName = "Data Component";
			break;
		case "COMPONENT_TYPE_CONNECTOR_BLOCKCHAIN":
			componentTypeName = "Blockchain Component";
			break;
		case "COMPONENT_TYPE_OPERATOR":
			componentTypeName = "Operator";
			break;
	}

	return (
		<div className="flex flex-row gap-x-3">
			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger asChild>
						{/* 
              eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            */}
						<span className="flex" tabIndex={0}>
							<Button
								className="!my-auto !px-1 !py-1 hover:!bg-semantic-bg-secondary"
								variant="tertiaryGrey"
								size="sm"
								disabled={testModeEnabled}
								onClick={(e) => {
									e.stopPropagation();
									setNodeIsCollapsed(!nodeIsCollapsed);
								}}
							>
								{nodeIsCollapsed ? (
									<Icons.Plus className="h-4 w-4 stroke-semantic-fg-secondary" />
								) : (
									<Icons.Minus className="h-4 w-4 stroke-semantic-fg-secondary" />
								)}
							</Button>
						</span>
					</Tooltip.Trigger>
					<Tooltip.Portal>
						<Tooltip.Content className="rounded-sm bg-semantic-bg-primary !px-3 !py-2 !product-body-text-4-semibold">
							{`${nodeIsCollapsed ? "Expand" : "Collapse"} component`}
							<Tooltip.Arrow
								className="fill-semantic-bg-primary"
								offset={10}
								width={9}
								height={6}
							/>
						</Tooltip.Content>
					</Tooltip.Portal>
				</Tooltip.Root>
			</Tooltip.Provider>

			{/* 
        Control - open right panel
      */}

			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger asChild>
						{/* 
              eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            */}
						<span className="flex" tabIndex={0}>
							<Button
								className="!my-auto !px-1 !py-1 hover:!bg-semantic-bg-secondary"
								variant="tertiaryGrey"
								size="sm"
								disabled={testModeEnabled}
								onClick={(e) => {
									e.stopPropagation();
									handleEditNode();
								}}
							>
								<Icons.Gear01 className="h-4 w-4 stroke-semantic-fg-secondary" />
							</Button>
						</span>
					</Tooltip.Trigger>
					<Tooltip.Portal>
						<Tooltip.Content className="rounded-sm bg-semantic-bg-primary !px-3 !py-2 !product-body-text-4-semibold">
							Open configuration right panel
							<Tooltip.Arrow
								className="fill-semantic-bg-primary"
								offset={10}
								width={9}
								height={6}
							/>
						</Tooltip.Content>
					</Tooltip.Portal>
				</Tooltip.Root>
			</Tooltip.Provider>

			{/* 
        Control - more options
      */}

			<Popover.Root
				open={moreOptionsIsOpen}
				onOpenChange={(open) => setMoreOptionsIsOpen(open)}
			>
				<Popover.Trigger>
					<Tooltip.Provider>
						<Tooltip.Root>
							<Tooltip.Trigger asChild>
								{/* 
                  eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                */}
								<span className="flex" tabIndex={0}>
									<Button
										className="!my-auto !px-1 !py-1 hover:!bg-semantic-bg-secondary"
										size="sm"
										variant="tertiaryGrey"
										type="button"
										disabled={testModeEnabled}
										onClick={() => {
											setMoreOptionsIsOpen(!moreOptionsIsOpen);
										}}
									>
										<Icons.DotsHorizontal className="h-4 w-4 stroke-semantic-fg-secondary" />
									</Button>
								</span>
							</Tooltip.Trigger>
							<Tooltip.Portal>
								<Tooltip.Content className="rounded-sm bg-semantic-bg-primary !px-3 !py-2 !product-body-text-4-semibold">
									More control options
									<Tooltip.Arrow
										className="fill-semantic-bg-primary"
										offset={10}
										width={9}
										height={6}
									/>
								</Tooltip.Content>
							</Tooltip.Portal>
						</Tooltip.Root>
					</Tooltip.Provider>
				</Popover.Trigger>

				<Popover.Content
					side="bottom"
					sideOffset={4}
					align="start"
					className="flex w-[200px] flex-col !rounded-sm !border !border-semantic-bg-line !p-0"
				>
					<div className="flex h-6 gap-x-3 rounded-t-sm border-b border-semantic-bg-line bg-semantic-bg-base-bg px-2">
						{componentTypeName ? (
							<p className="my-auto text-[10px] font-semibold text-semantic-fg-disabled">
								{componentTypeName}
							</p>
						) : null}
					</div>
					<div className="flex flex-col gap-y-1 py-2">
						<button
							onClick={(e) => {
								e.stopPropagation();
								handleCopyNode();
								setMoreOptionsIsOpen(false);
							}}
							className="flex flex-row gap-x-2 px-2 py-1 hover:bg-semantic-bg-base-bg"
						>
							<Icons.Copy07 className="h-4 w-4 stroke-semantic-fg-secondary" />
							<p className="text-semantic-fg-secondary product-body-text-4-medium">
								Duplicate
							</p>
						</button>
						<button
							onClick={(e) => {
								e.stopPropagation();
								handleDeleteNode();
								setMoreOptionsIsOpen(false);
							}}
							className="flex flex-row gap-x-2 px-2 py-1 hover:bg-semantic-bg-base-bg"
						>
							<Icons.Trash01 className="h-4 w-4 stroke-semantic-error-default" />
							<p className="text-semantic-error-default product-body-text-4-medium">
								Delete
							</p>
						</button>
					</div>
				</Popover.Content>
			</Popover.Root>
		</div>
	);
};
