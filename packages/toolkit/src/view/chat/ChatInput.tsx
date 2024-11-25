import BulletList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";

export const ChatInput = () => {
  const editor = useEditor({
    extensions: [Document, BulletList, Paragraph, Text],
    editorProps: {
      attributes: {
        class: "w-full h-full markdown-body rounded-[12px] p-6",
      },
    },
    content: "<h2>Your Pipeline Readme</h2>",
    // onUpdate: ({ editor }) => {},
  });

  <div
    className="flex flex-col px-2 border rounded"
    style={{
      borderColor: "#E1E6EF",
    }}
  >
    <div className="flex p-4">
      <EditorContent editor={editor} />
    </div>
  </div>;
};
