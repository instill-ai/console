import cn from "clsx";
import { useSortable } from "@dnd-kit/sortable";
import { ComplicateIcons } from "@instill-ai/design-system";
import { useReactFlow } from "reactflow";
import { CSS } from "@dnd-kit/utilities";

export const FieldRoot = ({
  fieldKey,
  children,
}: {
  fieldKey: string;
  children: React.ReactNode;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: fieldKey });

  const reactFlowInstance = useReactFlow();

  // Because dndkit is using the cached boundingbox information when first
  // render. They don't know the ancestor (reactflow) zoom level when
  // calculate the transform, we need to take it into account.
  const style = {
    transform: transform
      ? CSS.Transform.toString({
          x: transform.x / reactFlowInstance.getZoom(),
          y: transform.y / reactFlowInstance.getZoom(),
          scaleX: transform.scaleX,
          scaleY: transform.scaleY,
        })
      : undefined,
    transition,
  };

  return (
    <div
      {...attributes}
      style={style}
      key={fieldKey}
      className={cn(
        "nodrag group flex cursor-default flex-row gap-x-2 bg-semantic-bg-base-bg",
        isDragging ? "z-10" : ""
      )}
    >
      <div className="my-auto flex">
        <button
          {...listeners}
          className="h-4 w-4 opacity-0 group-hover:opacity-100"
          ref={setNodeRef}
          type="button"
        >
          <ComplicateIcons.Drag
            className="h-4 w-4"
            fillAreaColor="fill-semantic-node-connector-off"
          />
        </button>
      </div>
      <div className="flex w-full">{children}</div>
      {/* Placeholder */}
      <div className="flex h-4 w-4 flex-shrink-0"></div>
    </div>
  );
};
