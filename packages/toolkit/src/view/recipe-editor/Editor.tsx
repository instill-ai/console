"use client";

import * as React from "react";
import { autocompletion, CompletionContext } from "@codemirror/autocomplete";
import { linter, lintGutter } from "@codemirror/lint";
import { EditorView } from "@codemirror/view";
import { langs } from "@uiw/codemirror-extensions-langs";
import { githubLight } from "@uiw/codemirror-theme-github";
import CodeMirror, { Compartment } from "@uiw/react-codemirror";
import { PipelineComponentMap, PipelineRecipe } from "instill-sdk";
import yaml from "js-yaml";
import debounce from "lodash.debounce";

import {
  GeneralRecord,
  InstillStore,
  Nullable,
  SmartHint,
  useInstillStore,
  useRouteInfo,
  useShallow,
  useUpdateNamespacePipeline,
} from "../../lib";
import { transformInstillJSONSchemaToFormTree } from "../../lib/use-instill-form/transform";
import { transformFormTreeToSmartHints } from "../../lib/use-smart-hint/transformFormTreeToSmartHints";
import { getGeneralComponentInOutputSchema } from "../pipeline-builder";
import { isPipelineGeneralComponent } from "../pipeline-builder/lib/checkComponentType";
import { useEditor } from "./EditorContext";
import { PrettifyButton } from "./PrettifyButton";
import { validateYaml } from "./validateYaml";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
});

function myCompletions(
  context: CompletionContext,
  component: PipelineComponentMap,
) {
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

  let smartHints: SmartHint[] = [];

  for (const [key, value] of Object.entries(component)) {
    if (isPipelineGeneralComponent(value)) {
      const { outputSchema } = getGeneralComponentInOutputSchema(value);

      if (outputSchema) {
        const outputFormTree =
          transformInstillJSONSchemaToFormTree(outputSchema);

        const hints = transformFormTreeToSmartHints(outputFormTree, key);

        smartHints = [...smartHints, ...hints];
      }
    }
  }

  return {
    from: word.from,
    options: smartHints.map((hint) => ({
      label: "${" + hint.path + "}",
      detail: hint.description,
      type: hint.type,
    })),
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
  const updatePipeline = useUpdateNamespacePipeline();
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
            rawRecipe: newRawRecipe,
            namespacePipelineName: pipelineName,
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

  const pipelineComponentMap = React.useMemo(() => {
    return recipe?.component ?? {};
  }, [recipe]);

  const autoCompleteCompartment = React.useMemo(() => new Compartment(), []);

  const autoCompleteExtension = React.useMemo(
    () =>
      autoCompleteCompartment.of(
        autocompletion({
          override: [(context) => myCompletions(context, pipelineComponentMap)],
        }),
      ),
    [],
  );

  React.useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    const view = editorRef.current.view;

    if (!view) {
      return;
    }

    view.dispatch({
      effects: autoCompleteCompartment.reconfigure(
        autocompletion({
          override: [(context) => myCompletions(context, pipelineComponentMap)],
        }),
      ),
    });
  }, [pipelineComponentMap]);

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
            autoCompleteExtension,
            langs.yaml(),
            yamlLinter,
            lintGutter(),
            EditorView.lineWrapping,
          ]}
          theme={githubLight}
          onChange={(value) => {
            if (!routeInfo.isSuccess || !routeInfo.data.pipelineName) {
              return;
            }

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
