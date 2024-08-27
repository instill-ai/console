import * as React from "react";
import { useMouse } from "../lib/hook/useMouse";
import { Tooltip } from "@instill-ai/design-system";

const OFFSET = 16;

export function PointerTooltip({ children, isOpen, tooltipContent }: { children: React.ReactElement, isOpen: boolean, tooltipContent: React.ReactNode }) {
  const { x: mouseX, y: mouseY } = useMouse();
  const childOffset = React.useMemo(() => {
    if ('ref' in children) {
      const el = (children.ref as React.RefObject<HTMLElement>)?.current;

      if (el) {
        const rect = el.getBoundingClientRect();

        return {
          x: rect.x,
          y: rect.y,
        }
      }
    }

    return {
      x: 0,
      y: 0,
    }
  }, [children]);
console.log(children);
  return (
    <Tooltip.Provider>
      <Tooltip.Root open={isOpen}>
        <Tooltip.Trigger asChild>
          {children}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            avoidCollisions={false}
            align="start"
            alignOffset={-childOffset.x + mouseX + OFFSET}
            sideOffset={childOffset.y - mouseY - OFFSET}
          >
            {tooltipContent}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
