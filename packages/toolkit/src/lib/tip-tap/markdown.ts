// This is a copy of the prosemirror-markdown defaultMarkdownSerializer
// The reason we need this is due to TipTap doesn't support convert its
// output to Markdown format and we need to use this serializer to convert
// the output to Markdown format.
//
// ref1 - https://github.com/ProseMirror/prosemirror-markdown/blob/master/src/to_markdown.ts#L165
// ref2 - https://prosemirror.net/examples/markdown/
// ref3 - https://github.com/justinmoon/tiptap-markdown-demo/tree/master

/* eslint-disable no-useless-escape, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-explicit-any */

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

import {
  defaultMarkdownSerializer,
  MarkdownSerializerState,
  MarkdownSerializer as ProseMirrorMarkdownSerializer,
} from "prosemirror-markdown";
import { Mark, Node, Schema } from "prosemirror-model";
import MarkdownIt from "markdown-it";
import { DOMParser as ProseMirrorDOMParser } from "prosemirror-model";

const tableMap = new WeakMap();

function isInTable(node: Node) {
  return tableMap.has(node);
}

export function renderHardBreak(
  state: MarkdownSerializerState,
  node: Node,
  parent: Node,
  index: number
) {
  const br = isInTable(parent) ? "<br>" : "\\\n";
  for (let i = index + 1; i < parent.childCount; i += 1) {
    if (parent.child(i).type !== node.type) {
      state.write(br);
      return;
    }
  }
}

export function renderOrderedList(state: MarkdownSerializerState, node: Node) {
  const { parens } = node.attrs;
  const start = node.attrs.start || 1;
  const maxW = String(start + node.childCount - 1).length;
  const space = state.repeat(" ", maxW + 2);
  const delimiter = parens ? ")" : ".";
  state.renderList(node, space, (i) => {
    const nStr = String(start + i);
    return `${state.repeat(" ", maxW - nStr.length) + nStr}${delimiter} `;
  });
}

export function isPlainURL(
  link: Mark,
  parent: Node,
  index: number,
  side: number
) {
  if (link.attrs.title || !/^\w+:/.test(link.attrs.href)) return false;
  const content = parent.child(index + (side < 0 ? -1 : 0));
  if (
    !content.isText ||
    content.text !== link.attrs.href ||
    content.marks[content.marks.length - 1] !== link
  )
    return false;
  if (index === (side < 0 ? 1 : parent.childCount - 1)) return true;
  const next = parent.child(index + (side < 0 ? -2 : 1));
  return !link.isInSet(next.marks);
}

const serializerMarks = {
  ...defaultMarkdownSerializer.marks,
  [Bold.name]: defaultMarkdownSerializer.marks.strong,
  [Strike.name]: {
    open: "~~",
    close: "~~",
    mixable: true,
    expelEnclosingWhitespace: true,
  },
  [Italic.name]: {
    open: "_",
    close: "_",
    mixable: true,
    expelEnclosingWhitespace: true,
  },
  [Code.name]: defaultMarkdownSerializer.marks.code,
  [Link.name]: {
    open(_: MarkdownSerializerState, mark: Mark, parent: Node, index: number) {
      return isPlainURL(mark, parent, index, 1) ? "<" : "[";
    },
    close(
      state: MarkdownSerializerState,
      mark: Mark,
      parent: Node,
      index: number
    ) {
      const href = mark.attrs.canonicalSrc || mark.attrs.href;

      return isPlainURL(mark, parent, index, -1)
        ? ">"
        : `](${state.esc(href)})`;
    },
  },
};

const serializerNodes = {
  ...defaultMarkdownSerializer.nodes,
  [Paragraph.name]: (state: MarkdownSerializerState, node: Node) => {
    if (node.type.name === "paragraph" && node.content.size === 0) {
      state.write("<br>");
    }

    state.renderInline(node);
    state.closeBlock(node);
  },
  [BulletList.name]: defaultMarkdownSerializer.nodes.bullet_list,
  [ListItem.name]: defaultMarkdownSerializer.nodes.list_item,
  [HorizontalRule.name]: defaultMarkdownSerializer.nodes.horizontal_rule,
  [OrderedList.name]: renderOrderedList,
  [HardBreak.name]: renderHardBreak,
  [Blockquote.name]: (state: MarkdownSerializerState, node: Node) => {
    if (node.attrs.multiline) {
      state.write(">>>");
      state.ensureNewLine();
      state.renderContent(node);
      state.ensureNewLine();
      state.write(">>>");
      state.closeBlock(node);
    } else {
      state.wrapBlock("> ", null, node, () => state.renderContent(node));
    }
  },
};

export function serialize(schema: Schema, content: any) {
  const proseMirrorDocument = schema.nodeFromJSON(content);
  const serializer = new ProseMirrorMarkdownSerializer(
    serializerNodes,
    serializerMarks
  );

  return serializer.serialize(proseMirrorDocument, {
    tightLists: true,
  });
}

export function deserialize(schema: Schema, content: string) {
  const md = new MarkdownIt("commonmark", { html: true });
  const htmlString = md.render(String(content));

  const parser = new DOMParser();
  const { body } = parser.parseFromString(htmlString, "text/html");

  // append original source as a comment that nodes can access
  body.append(document.createComment(content));

  const state = ProseMirrorDOMParser.fromSchema(schema).parse(body);

  return state.toJSON();
}
