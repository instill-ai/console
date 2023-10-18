import { z } from "zod";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const messageBoxSchema = z.object({
  status: z.nullable(z.enum(["success", "error", "progressing"])),
  message: z.nullable(z.string()),
  description: z.nullable(z.string()),
  activate: z.boolean(),
});

export type MessageBoxState = z.infer<typeof messageBoxSchema>;

export type MessageBoxAction = {
  setState: (state: Partial<MessageBoxState>) => void;
  init: () => void;
};

export type MessageBoxStore = MessageBoxState & MessageBoxAction;

export const messageBoxInitialState: MessageBoxState = {
  status: null,
  message: null,
  description: null,
  activate: false,
};

export const useMessageBoxStore = create<MessageBoxStore>()(
  devtools((set) => ({
    ...messageBoxInitialState,
    init: () => set(messageBoxInitialState),
    setState: (newState) =>
      set((preState) => ({
        ...preState,
        ...newState,
      })),
  }))
);
