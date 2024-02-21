import cn from "clsx";
import { useSortable } from "@dnd-kit/sortable";
import { ComplicateIcons } from "@instill-ai/design-system";
import { useReactFlow } from "reactflow";
import { CSS } from "@dnd-kit/utilities";

export const NodeSortableFieldWrapper = ({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: path,
  });

  const reactFlowInstance = useReactFlow();

  // Because dndkit is using the cached boundingbox information when first
  // render. They don't know the ancestor (reBeactflow) zoom level when
  // calculate the transform, we need to take it into account.
  const style = {
    transform: transform
      ? CSS.Transform.toString({
          x: transform.x / reactFlowInstance.getZoom(),
          y: transform.y / reactFlowInstance.getZoom(),
          scaleX: 1,
          scaleY: 1,
        })
      : undefined,
    transition,
  };

  return (
    <div
      {...attributes}
      ref={setNodeRef}
      style={style}
      key={path}
      className={cn(
        "nodrag nowheel group relative flex cursor-default flex-row gap-x-2 bg-semantic-bg-base-bg",
        isDragging ? "z-10" : ""
      )}
    >
      <button
        {...listeners}
        ref={setActivatorNodeRef}
        className="absolute left-0 top-1/2 h-4 w-4 -translate-x-3 -translate-y-1/2 opacity-0 group-hover:opacity-100"
        type="button"
      >
        <ComplicateIcons.Drag
          className="h-4 w-4"
          fillAreaColor="fill-semantic-node-connector-off"
        />
      </button>
      <div className="flex w-full">{children}</div>
    </div>
  );
};
