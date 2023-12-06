import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Components/NewUi/Tabs",
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Regular: Story = {
  render: () => (
    <Tabs.Root className="h-[300px] w-[512px]">
      <Tabs.List className="flex w-full flex-row gap-x-0.5 px-2">
        <Tabs.Trigger value="snippet">Trigger Snippet</Tabs.Trigger>
        <Tabs.Trigger value="recipe">Recipe</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="snippet">
        <div className="w-full bg-semantic-bg-primary">
          {`curl -X POST {vdp-pipeline-base-url}/v1beta/{pipeline-name}/trigger 
--header 'Content-Type: application/json' 
--data '{input-array}'
`}
        </div>
      </Tabs.Content>
      <Tabs.Content value="recipe">
        <pre className="flex w-full whitespace-pre-wrap bg-semantic-bg-primary">
          {JSON.stringify(
            {
              version: "v1beta",
              components: [
                {
                  id: "start",
                  resource_name: "",
                  configuration: {
                    metadata: {
                      prompt: {
                        type: "text",
                        title: "prompt",
                      },
                    },
                  },
                  definition_name: "operator-definitions/start",
                },
                {
                  id: "end",
                  resource_name: "",
                  configuration: {
                    input: {
                      result: "{ ai_1.output.texts }",
                    },
                    metadata: {
                      result: {
                        title: "result",
                      },
                    },
                  },
                  definition_name: "operator-definitions/end",
                },
                {
                  id: "ai_1",
                  resource_name: "users/summerbud-test/connectors/openai-dev",
                  configuration: {
                    input: {
                      task: "TASK_TEXT_GENERATION",
                      prompt: "{ start.prompt }",
                      model: "gpt-3.5-turbo",
                      system_message:
                        "You are a cat, control a generator to produce more cat. ",
                      temperature: 0.8,
                    },
                  },
                  definition_name: "connector-definitions/openai",
                },
              ],
            },
            null,
            2
          )}
        </pre>
      </Tabs.Content>
    </Tabs.Root>
  ),
};
