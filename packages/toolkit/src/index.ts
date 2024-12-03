import BulletList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import ListItem from "@tiptap/extension-list-item";
import Mention, { MentionOptions } from "@tiptap/extension-mention";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import { EditorContent, ReactRenderer, useEditor } from "@tiptap/react";
import { SuggestionOptions, SuggestionProps } from "@tiptap/suggestion";

export * from "./components";
export * from "./constant";
export * from "./lib";
export * from "./view";

export type { SuggestionOptions, SuggestionProps, MentionOptions };

export const TipTap = {
  BulletList,
  Document,
  ListItem,
  Mention,
  Paragraph,
  Text,
  Placeholder,
  EditorContent,
  useEditor,
};

// We need to export ReactRenderer as a standalone module since it is a class
// If we put it into the TipTap object, TipTap will be recognized as namespace
export { ReactRenderer };
