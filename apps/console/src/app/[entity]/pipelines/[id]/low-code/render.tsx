"use client";

import { useAppAccessToken } from "lib/use-app-access-token";
import { useAppTrackToken } from "lib/useAppTrackToken";

import { RecipeEditorView } from "@instill-ai/toolkit";

export const RecipeEditorViewRender = () => {
  useAppAccessToken();
  useAppTrackToken({ enabled: true });

  return <RecipeEditorView />;
};
