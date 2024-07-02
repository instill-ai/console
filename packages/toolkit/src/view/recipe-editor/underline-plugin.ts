"use client";

/**
 * References:
 * https://github.com/uiwjs/react-codemirror/issues/257#issuecomment-1040089269
 * https://discuss.codemirror.net/t/how-to-highlight-lines/5448
 */
import {
  Decoration,
  EditorView,
  StateEffect,
  StateField,
} from "@uiw/react-codemirror";

const addUnderline = StateEffect.define<{ from: number; to: number }>();

const underlineMark = Decoration.mark({ class: "cm-underline" });

const underlineField = StateField.define({
  create() {
    return Decoration.none;
  },
  update(underlines, tr) {
    underlines = underlines.map(tr.changes);
    for (const e of tr.effects)
      if (e.is(addUnderline)) {
        underlines = underlines.update({
          add: [underlineMark.range(e.value.from, e.value.to)],
        });
      }
    return underlines;
  },
  provide: (f) => EditorView.decorations.from(f),
});

export const underlinePlugin = { addUnderline, underlineField, underlineMark };

/**
 * How to dispatch the transaction
 * 
 *  const view = editorRef.current?.view;

    if (!view) {
      return;
    }

    console.log(
      view.state.field(underlinePlugin.underlineField, false)?.size,
    );

    if (
      view.state.field(underlinePlugin.underlineField, false)?.size === 0
    ) {
      view.dispatch({
        effects: [underlinePlugin.addUnderline.of({ from: 0, to: 5 })],
      });
    }
 * 
 */
