"use client";

import * as React from "react";
import { autocompletion, CompletionContext } from "@codemirror/autocomplete";
import { linter, lintGutter } from "@codemirror/lint";
import { EditorView } from "@codemirror/view";
import { langs } from "@uiw/codemirror-extensions-langs";
import { githubLight } from "@uiw/codemirror-theme-github";
import CodeMirror from "@uiw/react-codemirror";
import yaml from "js-yaml";
import debounce from "lodash.debounce";

import {
  Definition,
  GeneralRecord,
  InstillStore,
  Nullable,
  PipelineComponent,
  PipelineRecipe,
  useInstillStore,
  useRouteInfo,
  useShallow,
  useUpdateUserPipeline,
} from "../../lib";
import { isPipelineGeneralComponent } from "../pipeline-builder/lib/checkComponentType";
import { useEditor } from "./EditorContext";
import { PrettifyButton } from "./PrettifyButton";
import { underlinePlugin } from "./underline-plugin";
import { useExtensionWithDependency } from "./use-extension-with-deps";
import { validateYaml } from "./validateYaml";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
});

function myCompletions(context: CompletionContext, definitions: Definition[]) {
  const word = context.matchBefore(/\${/);

  if (!word) {
    return null;
  }

  if (word.from == word.to && !context.explicit) {
    return null;
  }

  let data: Nullable<GeneralRecord> = null;

  try {
    data = yaml.load(context.state.doc.toString()) as GeneralRecord;
  } catch (error) {
    console.log(data);
    return null;
  }

  if (!data) {
    return null;
  }

  console.log(context, word, definitions);

  const component = data.component as Nullable<PipelineComponent>;

  if (!component) {
    return null;
  }

  for (const [key] of Object.entries(component)) {
    console.log(key);
  }

  return {
    from: word.from,
    options: [
      { label: "${match}", type: "keyword" },
      { label: "hello", type: "variable", info: "(World)" },
      { label: "magic", type: "text", apply: "⠁⭒*.✩.*⭒⠁", detail: "macro" },
    ],
  };
}
export const Editor = ({
  rawRecipe,
  recipe,
}: {
  rawRecipe: Nullable<string>;
  recipe: Nullable<PipelineRecipe>;
}) => {
  const { editorRef } = useEditor();
  const [schemaIsWrong, setSchemaIsWrong] = React.useState(false);
  const routeInfo = useRouteInfo();
  const updatePipeline = useUpdateUserPipeline();
  const { accessToken } = useInstillStore(useShallow(selector));

  const recipeUpdater = React.useCallback(
    debounce(
      ({
        pipelineName,
        newRawRecipe,
        accessToken,
      }: {
        pipelineName: string;
        newRawRecipe: string;
        accessToken: Nullable<string>;
      }) => {
        if (!accessToken) {
          return;
        }

        const diagnostics = validateYaml(newRawRecipe, true);

        if (diagnostics.length > 0) {
          setSchemaIsWrong(true);
          return;
        }

        setSchemaIsWrong(false);

        try {
          updatePipeline.mutateAsync({
            payload: {
              rawRecipe: newRawRecipe,
              name: pipelineName,
            },
            accessToken,
          });
        } catch (error) {
          console.error(error);
        }
      },
      1500,
    ),
    [updatePipeline],
  );

  const pipelineDefinitions = React.useMemo(() => {
    const definitions: Definition[] = [];

    if (!recipe || !recipe.component) {
      return definitions;
    }

    for (const [, value] of Object.entries(recipe.component)) {
      if (isPipelineGeneralComponent(value)) {
        if (value.definition) {
          definitions.push(value.definition);
        }
      }
    }

    return definitions;
  }, [recipe]);

  const customAutoComplete = useExtensionWithDependency(
    editorRef.current?.view ?? null,
    () =>
      autocompletion({
        override: [(context) => myCompletions(context, pipelineDefinitions)],
      }),
    pipelineDefinitions,
  );

  console.log(pipelineDefinitions);

  return (
    <React.Fragment>
      <style jsx>
        {`
          .cm-editor {
            height: 100%;
          }
        `}
      </style>
      <div className="h-full w-full">
        <div className="flex h-10 flex-row">
          <PrettifyButton />
          {schemaIsWrong ? <p>These has issue in the recipe</p> : null}
        </div>
        <CodeMirror
          ref={editorRef}
          className="h-full"
          value={rawRecipe ?? ""}
          extensions={[
            customAutoComplete,
            langs.yaml(),
            yamlLinter,
            lintGutter(),
            EditorView.lineWrapping,
            underlinePlugin.underlineField,
          ]}
          theme={githubLight}
          onChange={(value, view) => {
            if (!routeInfo.isSuccess || !routeInfo.data.pipelineName) {
              return;
            }

            console.log(view.state.doc.toString());

            recipeUpdater({
              newRawRecipe: value,
              accessToken,
              pipelineName: routeInfo.data.pipelineName,
            });
          }}
        />
      </div>
    </React.Fragment>
  );
};

const yamlLinter = linter((view) => {
  return validateYaml(view.state.doc.toString());
});
