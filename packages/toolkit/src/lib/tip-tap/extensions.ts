import Blockquote from "@tiptap/extension-blockquote";
import BulletList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { Extensions } from "@tiptap/react";

export const extensions: Extensions = [
  Document,
  Heading,
  Paragraph.configure({
    HTMLAttributes: {
      class: "!my-0",
    },
  }),
  ListItem,
  OrderedList.configure({
    HTMLAttributes: {
      class: "!mb-0",
    },
  }),
  Blockquote,
  BulletList.configure({
    HTMLAttributes: {
      class: "!mb-0",
    },
  }),
  Text,
  HardBreak,
];
