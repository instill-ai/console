"use client";

import { RecipeEditorView } from "@instill-ai/toolkit";

import { useAppAccessToken } from "~/lib/use-app-access-token";
import { useAppTrackToken } from "~/lib/useAppTrackToken";

export const RecipeEditorViewRender = () => {
  useAppAccessToken();
  useAppTrackToken({ enabled: true });

  return <RecipeEditorView />;
};
