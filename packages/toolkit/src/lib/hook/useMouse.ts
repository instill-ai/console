import { useEffect, useState } from "react";
import type { MouseEvent } from "react";

export function useMouse() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const setMousePosition = (e: Event) => {
    const event = e as unknown as  MouseEvent;
    
    setPosition({ x: event.clientX, y: event.clientY });
  };

  useEffect(() => {
    document.addEventListener("mousemove", setMousePosition);

    return () => {
      document.removeEventListener("mousemove", setMousePosition);
    };
  }, []);

  return position;
}
