"use client";

import { Button, Icons, ToggleGroup } from "@instill-ai/design-system";
import { MarkdownEditor } from "./";
import { debounce } from "../lib";
import * as React from "react";
import Markdown from "markdown-to-jsx";

type ViewMode = "view" | "edit";
type EditorMode = "edit" | "preview";

export type ModelReadmeProps = {
  readme?: string;
  onUpdate: (content: string) => Promise<void>;
  canEdit: boolean;
  placeholder?: string;
};

export const ReadmeEditor = ({ readme, onUpdate, canEdit, placeholder }: ModelReadmeProps) => {
  const [editorTopOffset, setEditorTopOffset] = React.useState(0);
  const [editorMode, setEditorMode] = React.useState<EditorMode>('edit');
  const [viewMode, setViewMode] = React.useState<ViewMode>('view');
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [content, setContent] = React.useState(readme || '');

  const debouncedUpdateModelReadme = React.useMemo(
    () =>
      debounce((value: string) => {
        setContent(value);
      }, 500),
    [],
  );

  const onUpdateReadme = async (content: string) => {
    setIsUpdating(true);

    await onUpdate(content);

    setIsUpdating(false);
    setViewMode("view");
    setEditorMode("edit");

    return;
  };

  const onMarkdownHeaderMount = React.useCallback((node: HTMLHeadingElement) => {
    if (!node) {
      return;
    }

    const boundingRect = node.getBoundingClientRect();

    setEditorTopOffset(boundingRect.bottom);
  }, []);

  const renderMarkdown = () => {
    return (
      <div className="markdown-body w-full overflow-x-auto px-3 py-2">
        <Markdown>{content || placeholder || ''}</Markdown>
      </div>
    )
  }

  const onEditorReset = () => {
    setViewMode("view");
    setEditorMode("edit");
    setContent(readme || "");
  }

  return (
    <div className="border rounded-sm border-semantic-bg-line bg-semantic-bg-base-bg overflow-hidden">
      <style jsx={true}>
        {`
          .mdxeditor-popup-container {
            display: none;
          }

          .markdown-body a {
            word-break: break-all !important;
          }

          .markdown-body pre code {
            white-space: pre-wrap !important;
          }

          .markdown-body p {
            white-space: pre-wrap !important;
          }

          .markdown-body ul > li {
            white-space: pre-wrap !important;
          }

          .markdown-body ol > li {
            white-space: pre-wrap !important;
          }

          .markdown-body h1,
          .markdown-body h2,
          .markdown-body h3,
          .markdown-body h4,
          .markdown-body h5,
          .markdown-body h6 {
            white-space: pre-wrap !important;
          }

          .markdown-body img {
            max-width: 100%;
            object-fit: contain;
          }
        `}
      </style>
      <div className="px-3 py-2 h-14 flex flex-row justify-between items-center" ref={onMarkdownHeaderMount}>
        {
          viewMode === "view"
            ? (
              <React.Fragment>
                <p className="text-semantic-fg-primary text-lg font-semibold uppercase">Readme</p>
                {canEdit
                  ? (
                    <div className="h-full aspect-square flex items-center justify-center cursor-pointer" onClick={() => setViewMode("edit")}>
                      <Icons.Edit05 className="h-4 w-4 stroke-semantic-fg-secondary" />
                    </div>
                  ) : null
                }
              </React.Fragment>
            )
            : (
              <React.Fragment>
                <ToggleGroup.Root
                  type="single"
                  value={editorMode}
                  onValueChange={(value: EditorMode) => setEditorMode(value)}
                >
                  <ToggleGroup.Item value="edit" className={editorMode === "edit" ? "pointer-events-none" : undefined}>Edit</ToggleGroup.Item>
                  <ToggleGroup.Item value="preview" className={editorMode === "preview" ? "pointer-events-none" : undefined}>Preview</ToggleGroup.Item>
                </ToggleGroup.Root>
                <div className="flex flex-row gap-x-4">
                  <Button variant="secondaryGrey" size="lg" onClick={onEditorReset} disabled={isUpdating}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="lg" onClick={() => onUpdateReadme(content)} disabled={isUpdating}>
                    Save Changes
                  </Button>
                </div>
              </React.Fragment>
            )
        }
      </div>
      {
        viewMode === "view"
          ? renderMarkdown()
          : (
            editorMode === "edit"
              ? (
                <div
                  className="w-full overflow-hidden"
                  style={{
                    height: `calc(100vh - ${editorTopOffset + 32}px)`,
                  }}
                >
                  <MarkdownEditor
                    readOnly={!canEdit}
                    markdown={content}
                    onChange={debouncedUpdateModelReadme}
                    className="bg-semantic-fg-on-default overflow-y-auto h-full [&_.cm-editor]:outline-none [&_.cm-gutters]:bg-semantic-bg-alt-primary [&_.cm-activeLine]:bg-semantic-bg-alt-primary [&_.cm-activeLineGutter]:bg-semantic-bg-alt-primary"
                  />
                </div>
              )
              : renderMarkdown()
          )
      }
    </div>
  );
};
