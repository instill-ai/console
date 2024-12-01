import BulletList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import ListItem from "@tiptap/extension-list-item";
import Mention from "@tiptap/extension-mention";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";

export * from "./components";
export * from "./constant";
export * from "./lib";
export * from "./view";

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
