import * as React from "react";
import BulletList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import ListItem from "@tiptap/extension-list-item";
import Mention from "@tiptap/extension-mention";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";

import { Button, Icons } from "@instill-ai/design-system";

import { useToolSuggestionConfig } from "./useToolSuggestionConfig";

export const ChatInput = () => {
  const toolSuggestionConfig = useToolSuggestionConfig();

  const editor = useEditor({
    extensions: [
      Document,
      BulletList.configure({
        HTMLAttributes: {
          class: "!mb-0",
        },
      }),
      ListItem,
      Paragraph,
      Text,
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
        suggestion: toolSuggestionConfig,
      }),
      Placeholder.configure({
        placeholder: "Ask something or @mention an action",
      }),
    ],
    editorProps: {
      attributes: {
        class: "w-full h-full markdown-body pl-4 py-4 focus:outline-none",
      },
    },
    // onUpdate: ({ editor }) => {},
  });

  return (
    <React.Fragment>
      <style jsx={true} global={true}>
        {`
          .mention {
            background-color: #f0f0f0;
            padding: 0.1rem 0.3rem;
            border-radius: 0.4rem;
            box-decoration-break: clone;
          }
        `}
      </style>
      <div
        className="flex flex-col px-2 border rounded"
        style={{
          borderColor: "#E1E6EF",
        }}
      >
        <div className="flex flex-row w-full pr-4">
          <EditorContent className="w-full" editor={editor} />
          <Button variant="primary" size="sm" className="!p-2 my-auto">
            <Icons.ArrowNarrowRight className="w-4 h-4 stroke-semantic-bg-primary" />
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};
