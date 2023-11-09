import * as React from "react";
import * as z from "zod";
import { Button, Form, Textarea } from "@instill-ai/design-system";

import MonacoEditor from "@monaco-editor/react";
import { InstillJSONSchema, useInstillForm } from "@instill-ai/toolkit";

export default function Home() {
  const [code, setCode] = React.useState<string | null>(null);
  const [schema, setSchema] = React.useState<InstillJSONSchema | null>(null);
  const [isValid, setIsValid] = React.useState(false);
  const [data, setData] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const { form, fields, ValidatorSchema, formTree } = useInstillForm(
    schema,
    null
  );

  return (
    <div className="flex flex-1 min-h-screen min-w-[100vh] flex-col">
      <div className="flex m-auto flex-row gap-x-10 w-full max-w-[1200px] p-10">
        <div className="flex flex-col gap-y-5 w-1/2">
          <div className="flex flex-col h-1/3 w-full">
            <MonacoEditor
              language="json"
              value={code ?? ""}
              theme="vs-light"
              height={300}
              onChange={(code) => {
                if (!code) return;
                setCode(code);

                try {
                  const parsedCode = JSON.parse(code);
                  setIsValid(true);
                  setSchema(parsedCode);
                } catch (err) {
                  setIsValid(false);
                }
              }}
              options={{
                minimap: {
                  enabled: false,
                },
                automaticLayout: true,
              }}
              className="border border-black h-full"
            />
          </div>
          <div className="flex flex-col h-1/3 w-full">
            <MonacoEditor
              language="json"
              value={formTree ? JSON.stringify(formTree, null, 2) : ""}
              theme="vs-light"
              height={300}
              options={{
                minimap: {
                  enabled: false,
                },
                automaticLayout: true,
              }}
              className="border border-black h-full"
            />
          </div>
          <div className="flex flex-col h-1/3 w-full">
            <MonacoEditor
              language="json"
              value={error ? error : data ? data : ""}
              theme="vs-light"
              height={300}
              options={{
                minimap: {
                  enabled: false,
                },
                automaticLayout: true,
              }}
              className="border border-black h-full"
            />
          </div>
        </div>
        <div className="flex flex-col h-full w-1/2 p-4">
          <Form.Root {...form}>
            <form className="w-full">
              <div className="flex flex-col gap-y-5 mb-5">{fields}</div>
              <div className="flex flex-row-reverse">
                <Button
                  type="button"
                  size="lg"
                  variant="primary"
                  onClick={() => {
                    const data = form.getValues();

                    try {
                      const parsedData = ValidatorSchema.parse(data);
                      setData(JSON.stringify(parsedData, null, 2));
                      setError(null);
                    } catch (err) {
                      if (err instanceof z.ZodError) {
                        setError(JSON.stringify(err, null, 2));
                      }
                    }
                  }}
                >
                  Submit
                </Button>
              </div>
            </form>
          </Form.Root>
        </div>
      </div>
    </div>
  );
}
