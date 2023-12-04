// This is a copy of the prosemirror-markdown defaultMarkdownSerializer
// The reason we need this is due to TipTap doesn't support convert its
// output to Markdown format and we need to use this serializer to convert
// the output to Markdown format.
//
// ref1 - https://github.com/ProseMirror/prosemirror-markdown/blob/master/src/to_markdown.ts#L165
// ref2 - https://prosemirror.net/examples/markdown/

/* eslint-disable no-useless-escape, @typescript-eslint/no-non-null-assertion */

import { MarkdownSerializer } from "prosemirror-markdown";
import { Node } from "prosemirror-model";

export const customMarkdownSerializer = new MarkdownSerializer(
  {
    blockquote(state, node) {
      state.wrapBlock("> ", null, node, () => state.renderContent(node));
    },
    codeBlock(state, node) {
      // Make sure the front matter fences are longer than any dash sequence within it
      const backticks = node.textContent.match(/`{3,}/gm);
      const fence = backticks ? backticks.sort().slice(-1)[0] + "`" : "```";

      state.write(fence + (node.attrs.params || "") + "\n");
      state.text(node.textContent, false);
      // Add a newline to the current content before adding closing marker
      state.write("\n");
      state.write(fence);
      state.closeBlock(node);
    },
    heading(state, node) {
      state.write(state.repeat("#", node.attrs.level) + " ");
      state.renderInline(node);
      state.closeBlock(node);
    },
    horizontalRule(state, node) {
      state.write(node.attrs.markup || "---");
      state.closeBlock(node);
    },
    bulletList(state, node) {
      state.renderList(node, "  ", () => (node.attrs.bullet || "*") + " ");
    },
    orderedList(state, node) {
      const start = node.attrs.order || 1;
      const maxW = String(start + node.childCount - 1).length;
      const space = state.repeat(" ", maxW + 2);
      state.renderList(node, space, (i) => {
        const nStr = String(start + i);
        return state.repeat(" ", maxW - nStr.length) + nStr + ". ";
      });
    },
    listItem(state, node) {
      state.renderContent(node);
    },
    paragraph(state, node) {
      state.renderInline(node);
      state.closeBlock(node);
    },

    image(state, node) {
      state.write(
        "![" +
          state.esc(node.attrs.alt || "") +
          "](" +
          node.attrs.src.replace(/[\(\)]/g, "\\$&") +
          (node.attrs.title
            ? ' "' + node.attrs.title.replace(/"/g, '\\"') + '"'
            : "") +
          ")"
      );
    },
    hardBreak(state, node, parent, index) {
      for (let i = index + 1; i < parent.childCount; i++)
        if (parent.child(i).type != node.type) {
          state.write("\\\n");
          return;
        }
    },
    text(state, node) {
      state.text(node.text!);
    },
  },
  {
    em: {
      open: "*",
      close: "*",
      mixable: true,
      expelEnclosingWhitespace: true,
    },
    strong: {
      open: "**",
      close: "**",
      mixable: true,
      expelEnclosingWhitespace: true,
    },
    code: {
      open(_state, _mark, parent, index) {
        return backticksFor(parent.child(index), -1);
      },
      close(_state, _mark, parent, index) {
        return backticksFor(parent.child(index - 1), 1);
      },
      escape: false,
    },
  }
);

function backticksFor(node: Node, side: number) {
  const ticks = /`+/g;
  let m,
    len = 0;
  if (node.isText)
    while ((m = ticks.exec(node.text!))) len = Math.max(len, m[0].length);
  let result = len > 0 && side > 0 ? " `" : "`";
  for (let i = 0; i < len; i++) result += "`";
  if (len > 0 && side < 0) result += " ";
  return result;
}
