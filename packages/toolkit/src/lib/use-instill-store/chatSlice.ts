import { Citation } from "instill-sdk";
import { StateCreator } from "zustand";

import {
  ChatSlice,
  InstillChatAgentStatus,
  InstillChatError,
  InstillStore,
  InstillStoreMutators,
} from "./types";

export const createChatSlice: StateCreator<
  InstillStore,
  InstillStoreMutators,
  [],
  ChatSlice
> = (set) => ({
  enabledTools: [],
  updateEnabledTools: (fn: (prev: string[]) => string[]) =>
    set((state) => {
      return {
        ...state,
        enabledTools: fn(state.enabledTools),
      };
    }),
  enableToolSuggestion: false,
  updateEnableToolSuggestion: (fn: (prev: boolean) => boolean) =>
    set((state) => {
      return {
        ...state,
        enableToolSuggestion: fn(state.enableToolSuggestion),
      };
    }),
  leftSidebarOpen: false,
  updateLeftSidebarOpen: (fn: (prev: boolean) => boolean) =>
    set((state) => {
      return {
        ...state,
        leftSidebarOpen: fn(state.leftSidebarOpen),
      };
    }),
  rightSidebarOpen: false,
  updateRightSidebarOpen: (fn: (prev: boolean) => boolean) =>
    set((state) => {
      return {
        ...state,
        rightSidebarOpen: fn(state.rightSidebarOpen),
      };
    }),
  chatFullscreenOpen: true,
  updateChatFullscreenOpen: (fn: (prev: boolean) => boolean) =>
    set((state) => {
      return {
        ...state,
        chatFullscreenOpen: fn(state.chatFullscreenOpen),
      };
    }),
  chatStreamIsActive: false,
  updateChatStreamIsActive: (fn: (prev: boolean) => boolean) =>
    set((state) => {
      return {
        ...state,
        chatStreamIsActive: fn(state.chatStreamIsActive),
      };
    }),
  chatIsBusy: false,
  updateChatIsBusy: (fn: (prev: boolean) => boolean) =>
    set((state) => {
      return {
        ...state,
        chatIsBusy: fn(state.chatIsBusy),
      };
    }),
  chatAgentStatus: null,
  updateChatAgentStatus: (
    fn: (prev: InstillChatAgentStatus) => InstillChatAgentStatus,
  ) =>
    set((state) => {
      return {
        ...state,
        chatAgentStatus: fn(state.chatAgentStatus),
      };
    }),
  chatError: null,
  updateChatError: (fn: (prev: InstillChatError) => InstillChatError) =>
    set((state) => {
      return {
        ...state,
        chatError: fn(state.chatError),
      };
    }),
  currentActiveCitationListInTheRightDrawer: [],
  updateCurrentActiveCitationListInTheRightDrawer: (
    fn: (prev: Citation[]) => Citation[],
  ) =>
    set((state) => {
      return {
        ...state,
        currentActiveCitationListInTheRightDrawer: fn(
          state.currentActiveCitationListInTheRightDrawer,
        ),
      };
    }),
  isWebSearchEnabled: false,
  updateIsWebSearchEnabled: (fn: (prev: boolean) => boolean) =>
    set((state) => {
      return {
        ...state,
        isWebSearchEnabled: fn(state.isWebSearchEnabled),
      };
    }),
  isTableUpdated: false,
  updateIsTableUpdated: (fn: (prev: boolean) => boolean) =>
    set((state) => {
      return {
        ...state,
        isTableUpdated: fn(state.isTableUpdated),
      };
    }),
});
