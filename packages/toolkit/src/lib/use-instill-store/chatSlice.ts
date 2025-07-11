import { Citation, Nullable } from "instill-sdk";
import { StateCreator } from "zustand";

import {
  ChatDrawerType,
  ChatSlice,
  InstillChatAgentStatus,
  InstillChatError,
  InstillChatMessageContextFile,
  InstillStore,
  InstillStoreMutators,
  PendingFile,
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
  chatDrawerType: null,
  updateChatDrawerType: (fn: (prev: ChatDrawerType) => ChatDrawerType) =>
    set((state) => {
      return {
        ...state,
        chatDrawerType: fn(state.chatDrawerType),
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
  chatStreamIsActive: {},
  updateChatStreamIsActive: (
    fn: (prev: Record<string, boolean>) => Record<string, boolean>,
  ) =>
    set((state) => {
      return {
        ...state,
        chatStreamIsActive: fn(state.chatStreamIsActive),
      };
    }),
  chatIsBusy: {},
  updateChatIsBusy: (
    fn: (prev: Record<string, boolean>) => Record<string, boolean>,
  ) =>
    set((state) => {
      return {
        ...state,
        chatIsBusy: fn(state.chatIsBusy),
      };
    }),
  chatAgentStatus: {},
  updateChatAgentStatus: (
    fn: (
      prev: Record<string, InstillChatAgentStatus>,
    ) => Record<string, InstillChatAgentStatus>,
  ) =>
    set((state) => {
      return {
        ...state,
        chatAgentStatus: fn(state.chatAgentStatus),
      };
    }),
  chatError: {},
  updateChatError: (
    fn: (
      prev: Record<string, InstillChatError>,
    ) => Record<string, InstillChatError>,
  ) =>
    set((state) => {
      return {
        ...state,
        chatError: fn(state.chatError),
      };
    }),
  currentActiveCitationListInTheRightDrawer: {},
  updateCurrentActiveCitationListInTheRightDrawer: (
    fn: (prev: Record<string, Citation[]>) => Record<string, Citation[]>,
  ) =>
    set((state) => {
      return {
        ...state,
        currentActiveCitationListInTheRightDrawer: fn(
          state.currentActiveCitationListInTheRightDrawer,
        ),
      };
    }),
  isTableUpdated: {},
  updateIsTableUpdated: (
    fn: (prev: Record<string, boolean>) => Record<string, boolean>,
  ) =>
    set((state) => {
      return {
        ...state,
        isTableUpdated: fn(state.isTableUpdated),
      };
    }),
  uploadFilesPending: {},
  updateUploadFilesPending: (
    fn: (prev: Record<string, PendingFile[]>) => Record<string, PendingFile[]>,
  ) =>
    set((state) => {
      return {
        ...state,
        uploadFilesPending: fn(state.uploadFilesPending),
      };
    }),
  tempFileCatalogId: null,
  updateTempFileCatalogId: (fn: (prev: Nullable<string>) => Nullable<string>) =>
    set((state) => {
      return {
        ...state,
        tempFileCatalogId: fn(state.tempFileCatalogId),
      };
    }),
  chatMessageContextTableUids: {},
  updateChatMessageContextTableUids: (
    fn: (prev: Record<string, string[]>) => Record<string, string[]>,
  ) =>
    set((state) => {
      return {
        ...state,
        chatMessageContextTableUids: fn(state.chatMessageContextTableUids),
      };
    }),
  chatMessageContextFiles: {},
  updateChatMessageContextFiles: (
    fn: (
      prev: Record<string, InstillChatMessageContextFile[]>,
    ) => Record<string, InstillChatMessageContextFile[]>,
  ) =>
    set((state) => {
      return {
        ...state,
        chatMessageContextFiles: fn(state.chatMessageContextFiles),
      };
    }),
  chatMessageContextFolderUids: {},
  updateChatMessageContextFolderUids: (
    fn: (prev: Record<string, string[]>) => Record<string, string[]>,
  ) =>
    set((state) => {
      return {
        ...state,
        chatMessageContextFolderUids: fn(state.chatMessageContextFolderUids),
      };
    }),
  chatMessageContextCatalogUids: {},
  updateChatMessageContextCatalogUids: (
    fn: (prev: Record<string, string[]>) => Record<string, string[]>,
  ) =>
    set((state) => {
      return {
        ...state,
        chatMessageContextCatalogUids: fn(state.chatMessageContextCatalogUids),
      };
    }),
});
