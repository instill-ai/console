import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type ModalState = {
  modalIsOpen: boolean;
};

export type ModalAction = {
  closeModal: () => void;
  openModal: () => void;
  init: () => void;
};

export type ModalStore = ModalState & ModalAction;

export const modalInitialState: ModalState = {
  modalIsOpen: false,
};

export const useModalStore = create<ModalStore>()(
  devtools((set) => ({
    ...modalInitialState,
    init: () => set(() => modalInitialState),
    closeModal: () =>
      set(() => ({
        modalIsOpen: false,
      })),
    openModal: () =>
      set(() => ({
        modalIsOpen: true,
      })),
  }))
);
