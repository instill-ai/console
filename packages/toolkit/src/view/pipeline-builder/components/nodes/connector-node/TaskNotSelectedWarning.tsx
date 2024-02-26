import { Nullable, PipelineComponentType } from "../../../../../lib";

export const TaskNotSelectedWarning = ({
  componentType,
}: {
  componentType: PipelineComponentType;
}) => {
  let label: Nullable<string> = null;

  switch (componentType) {
    case "COMPONENT_TYPE_CONNECTOR_AI":
      label = "AI";
      break;
    case "COMPONENT_TYPE_CONNECTOR_DATA":
      label = "Data";
      break;
    case "COMPONENT_TYPE_CONNECTOR_APPLICATION":
      label = "Application";
      break;
  }

  return label ? (
    <div className="mb-3 w-full rounded-sm border border-semantic-warning-default bg-semantic-warning-bg p-4">
      <p className="text-semantic-fg-primary product-body-text-3-regular">
        {`Please select ${label} task for this connector`}
      </p>
    </div>
  ) : null;
};
