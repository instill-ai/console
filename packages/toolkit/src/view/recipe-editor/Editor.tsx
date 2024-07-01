"use client";

import * as React from "react";
import { linter, lintGutter } from "@codemirror/lint";
import { EditorView } from "@codemirror/view";
import { langs } from "@uiw/codemirror-extensions-langs";
import { githubLight } from "@uiw/codemirror-theme-github";
import CodeMirror from "@uiw/react-codemirror";

import {
  InstillStore,
  Nullable,
  useInstillStore,
  useRouteInfo,
  useShallow,
  useUpdateUserPipeline,
} from "../../lib";
import { validateYaml } from "./validateYaml";
import debounce from "lodash.debounce";
import { useEditor } from "./EditorContext";
import { PrettifyButton } from "./PrettifyButton";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
});

export const Editor = ({ recipe }: { recipe: Nullable<string> }) => {
  const { editorRef } = useEditor();
  const [schemaIsWrong, setSchemaIsWrong] = React.useState(false);
  const routeInfo = useRouteInfo();
  const updatePipeline = useUpdateUserPipeline();
  const { accessToken } = useInstillStore(useShallow(selector));

  const recipeUpdater = React.useCallback(
    debounce(
      ({
        pipelineName,
        rawRecipe,
        accessToken,
      }: {
        pipelineName: string;
        rawRecipe: string;
        accessToken: Nullable<string>;
      }) => {
        if (!accessToken) {
          return;
        }

        const diagnostics = validateYaml(rawRecipe, true);

        if (diagnostics.length > 0) {
          setSchemaIsWrong(true);
          return;
        }

        setSchemaIsWrong(false);

        try {
          updatePipeline.mutateAsync({
            payload: {
              rawRecipe,
              name: pipelineName,
            },
            accessToken,
          });
        } catch (error) {
          console.error(error);
        }
      },
      1500
    ),
    [updatePipeline]
  );

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
          value={recipe ?? ""}
          extensions={[
            langs.yaml(),
            yamlLinter,
            lintGutter(),
            EditorView.lineWrapping,
          ]}
          theme={githubLight}
          onChange={(value, view) => {
            if (!routeInfo.isSuccess || !routeInfo.data.pipelineName) {
              return;
            }

            console.log(view.state.doc.toString());

            recipeUpdater({
              rawRecipe: value,
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
