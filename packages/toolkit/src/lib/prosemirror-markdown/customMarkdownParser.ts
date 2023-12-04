/// A parser parsing unextended [CommonMark](http://commonmark.org/),
/// ref: https://github.com/ProseMirror/prosemirror-markdown/blob/master/src/from_markdown.ts

import { MarkdownParser, schema } from "prosemirror-markdown";
import MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";

/// without inline HTML, and producing a document in the basic schema.
export const customMarkdownParser = new MarkdownParser(
  schema,
  MarkdownIt("commonmark", { html: false }),
  {
    blockquote: { block: "blockquote" },
    paragraph: { block: "paragraph" },
    list_item: { block: "list_item" },
    bullet_list: {
      block: "bullet_list",
      getAttrs: (_, tokens, i) => ({ tight: listIsTight(tokens, i) }),
    },
    ordered_list: {
      block: "ordered_list",
      getAttrs: (tok, tokens, i) => ({
        order: +tok.attrGet("start")! || 1,
        tight: listIsTight(tokens, i),
      }),
    },
    heading: {
      block: "heading",
      getAttrs: (tok) => ({ level: +tok.tag.slice(1) }),
    },
    code_block: { block: "code_block", noCloseToken: true },
    fence: {
      block: "code_block",
      getAttrs: (tok) => ({ params: tok.info || "" }),
      noCloseToken: true,
    },
    hr: { node: "horizontal_rule" },
    image: {
      node: "image",
      getAttrs: (tok) => ({
        src: tok.attrGet("src"),
        title: tok.attrGet("title") || null,
        alt: (tok.children![0] && tok.children![0].content) || null,
      }),
    },
    hardbreak: { node: "hard_break" },

    em: { mark: "em" },
    strong: { mark: "strong" },
    link: {
      mark: "link",
      getAttrs: (tok) => ({
        href: tok.attrGet("href"),
        title: tok.attrGet("title") || null,
      }),
    },
    code_inline: { mark: "code", noCloseToken: true },
  }
);

function listIsTight(tokens: readonly Token[], i: number) {
  while (++i < tokens.length)
    if (tokens[i].type != "list_item_open") return tokens[i].hidden;
  return false;
}
