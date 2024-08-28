"use client";

import * as React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { stackoverflowLight } from "react-syntax-highlighter/dist/esm/styles/hljs";

import { cn, Icons, Separator } from "@instill-ai/design-system";

import { DefaultEditorViewIDs, EditorView } from "../../../lib";
import {
  addOutputCodeHint,
  addOutputCodeTemplate,
  addVariableCodeHint,
  addVariableCodeTemplate,
} from "./codeTemplate";

export const GettingStartedView = () => {
  return (
    <div className="flex w-full px-3 py-4">
      <div className="w-[500px] mx-auto flex flex-col">
        <div className="flex flex-col gap-y-1">
          <h3 className="product-headings-heading-5 text-semantic-fg-primary">
            Getting Started
          </h3>
          <p className="product-body-text-4-regular text-semantic-fg-secondary">
            You don&apos;t need to start from scratch—let me show you some tips.
          </p>
        </div>
        <Separator orientation="horizontal" className="my-3" />
        <div className="flex flex-col w-full gap-y-2">
          <Block indexClassName="pt-0.5" index={1}>
            <div className="flex flex-row gap-x-[7px] product-body-text-4-regular text-semantic-fg-primary">
              <span className="my-auto">To add a component you can click</span>
              <ShortCut shortcut="+ Add Component" />
              <span className="my-auto">or simply hit</span>
              <ShortCut shortcut="⌘O" />
            </div>
          </Block>
          <Block index={2}>
            <div className="flex flex-col gap-y-2">
              <p className="product-body-text-4-regular text-semantic-fg-primary">
                To add a variable in YAML.
              </p>
              <CodeBlock
                displayCode={addVariableCodeHint}
                copyCode={addVariableCodeTemplate}
              />
            </div>
          </Block>
          <Block index={3}>
            <div className="flex flex-col gap-y-2">
              <p className="product-body-text-4-regular text-semantic-fg-primary">
                To add an output in YAML.
              </p>
              <CodeBlock
                displayCode={addOutputCodeHint}
                copyCode={addOutputCodeTemplate}
              />
            </div>
          </Block>
          <Block indexClassName="pt-0.5" index={4}>
            <div className="flex flex-row gap-x-[7px] product-body-text-4-regular text-semantic-fg-primary">
              <span className="my-auto">
                If you want to search for something, you can press
              </span>
              <ShortCut shortcut="⌘K" />
            </div>
          </Block>
          <Block index={5}>
            <p className="product-body-text-4-regular text-semantic-fg-primary">
              <span className="my-auto">
                If you still find it difficult, you can
              </span>
              <a
                className="mx-0.5 hover:underline text-semantic-accent-hover"
                href="https://instill.tech/explore/pipelines"
              >
                explore
              </a>
              <span>
                other pipelines and clone one to customize it to your needs.
              </span>
            </p>
          </Block>
          <Block index={6}>
            <p className="flex flex-row gap-x-[7px] product-body-text-4-regular text-semantic-fg-primary">
              If you forget these getting started tips and want a refresher,
              just open the left panel—I&apos;m always here to help.
            </p>
          </Block>
        </div>
      </div>
    </div>
  );
};

export const gettingStartedEditorView: EditorView = {
  id: DefaultEditorViewIDs.GETTING_STARTED,
  title: "Getting Started",
  type: "docs",
  view: <GettingStartedView />,
  closeable: true,
};

const Block = ({
  index,
  children,
  indexClassName,
}: {
  index: number;
  children: React.ReactNode;
  indexClassName?: string;
}) => {
  return (
    <div className="flex flex-row gap-x-2">
      <div className={cn("flex", indexClassName)}>
        <p className="product-body-text-4-regular align-middle text-semantic-fg-primary">
          {index}
        </p>
      </div>
      {children}
    </div>
  );
};

const ShortCut = ({
  shortcut,
  onClick,
}: {
  shortcut: string;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "bg-semantic-bg-alt-primary rounded border border-semantic-bg-line px-1 py-0.5",
        onClick
          ? "cursor-pointer hover:bg-semantic-bg-secondary"
          : "cursor-default",
      )}
    >
      <p className="product-body-text-4-regular text-semantic-fg-secondary">
        {shortcut}
      </p>
    </button>
  );
};

const CodeBlock = ({
  displayCode,
  copyCode,
}: {
  displayCode: string;
  copyCode: string;
}) => {
  const [copied, setCopied] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      className="w-full relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered ? (
        <button
          type="button"
          className="top-2 right-2 absolute opacity-50"
          onClick={async () => {
            await navigator.clipboard.writeText(copyCode);
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 1000);
          }}
        >
          {copied ? (
            <React.Fragment>
              <Icons.Check className="h-4 w-4 stroke-semantic-fg-primary" />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Icons.Copy06 className="h-4 w-4 stroke-semantic-fg-primary" />
            </React.Fragment>
          )}
        </button>
      ) : null}
      <SyntaxHighlighter
        language="yaml"
        showLineNumbers={false}
        style={{
          ...stackoverflowLight,
          hljs: {
            display: "block",
            overflowX: "auto",
            padding: "0.5em",
            color: "#2f3337",
            background: "#F8F9FC",
          },
        }}
        customStyle={{
          fontSize: "12px",
          wordSpacing: "-.4ch",
        }}
        wrapLines={true}
        wrapLongLines={true}
      >
        {displayCode}
      </SyntaxHighlighter>
    </div>
  );
};
