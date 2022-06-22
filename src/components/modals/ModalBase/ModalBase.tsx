import { Nullable } from "@/types/general";
import { FC, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import cn from "clsx";

export type ModalBaseProps = {
  modalIsOpen: boolean;
  modalBgColor: Nullable<string>;
  modalPadding: Nullable<string>;
};

const ModalBase: FC<ModalBaseProps> = ({
  children,
  modalIsOpen,
  modalBgColor,
  modalPadding,
}) => {
  const el = useRef<HTMLDivElement>();

  useEffect(() => {
    el.current = document.createElement("div");
    el.current.setAttribute("role", "dialog");
    el.current.setAttribute("aria-modal", "true");
    el.current.setAttribute("class", "relative z-10");
    el.current.setAttribute("aria-labelledby", "modal-title");

    const modalRoot = document.querySelector("#modal-root");
    if (modalRoot) {
      modalRoot.appendChild(el.current);
    }

    return () => {
      if (!el.current || !modalRoot) return;
      modalRoot.removeChild(el.current);
    };
  }, []);

  // Instead of `el`, the container is the `ref.current`
  return el.current
    ? modalIsOpen
      ? createPortal(
          <>
            {/** Background backdrop, show/hide based on modal state. */}
            <div className="fixed inset-0 bg-instillGrey95 bg-opacity-50 transition-opacity"></div>

            {/** Modal panel, show/hide based on modal state. */}
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div
                  className={cn(
                    "relative transform overflow-hidden text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg",
                    modalBgColor,
                    modalPadding
                  )}
                >
                  {children}
                </div>
              </div>
            </div>
          </>,
          el.current
        )
      : null
    : null;
};

export default ModalBase;
