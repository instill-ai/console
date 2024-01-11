import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Strike from "@tiptap/extension-strike";
import Italic from "@tiptap/extension-italic";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import HardBreak from "@tiptap/extension-hard-break";
import Code from "@tiptap/extension-code";
import Bold from "@tiptap/extension-bold";
import Blockquote from "@tiptap/extension-blockquote";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
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
  Strike,
  Italic,
  HorizontalRule,
  Code,
  Bold,
  Link,
  Placeholder.configure({
    placeholder: "Type something here...",
  }),
];
