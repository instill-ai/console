# How to contribute a pipeline template to instill-ai

## set up the environment

Please follow the steps in the [CONTRIBUTION](/.github/CONTRIBUTING.md) to set up the console locally.

## Clean up the recipe

Copy the recipe from instill-ai console's toolkit. And then do two things to the component in the components array

1. Replace the `resource_name` value with null
2. Add a `resource: null` into the component

For example, this is a pipeline with basic configuration

```ts
{
  "version": "v1beta",
  "components": [
    {
      "id": "trigger",
      "resource_name": "",
      "configuration": {
        "metadata": {}
      },
      "definition_name": "operator-definitions/start"
    },
    {
      "id": "response",
      "resource_name": "",
      "configuration": {
        "input": {},
        "metadata": {}
      },
      "definition_name": "operator-definitions/end"
    },
    {
      "id": "ai_1",
      "resource_name": "users/admin/connectors/yoyo",
      "configuration": {
        "input": {
          "image_base64": "{ trigger.image }",
          "model_id": "hello",
          "model_namespace": "instill-ai"
        },
        "task": "TASK_KEYPOINT"
      },
      "definition_name": "connector-definitions/instill-model"
    }
  ]
}
```

This is the correct template after cleaning it up

```ts
{
  "version": "v1beta",
  "components": [
    {
      "id": "start",
      "resource_name": null,
      "resource": null,
      "configuration": {
        "metadata": {}
      },
      "definition_name": "operator-definitions/start"
    },
    {
      "id": "end",
      "resource_name": null,
      "resource": null,
      "configuration": {
        "input": {},
        "metadata": {}
      },
      "definition_name": "operator-definitions/end"
    },
    {
      "id": "ai_1",
      "resource_name": null,
      "resource": null,
      "configuration": {
        "input": {
          "image_base64": "{ trigger.image }",
          "model_id": "hello",
          "model_namespace": "instill-ai"
        },
        "task": "TASK_KEYPOINT"
      },
      "definition_name": "connector-definitions/instill-model"
    }
  ]
}
```

## Put template into the file

The file we store template is [here](/packages/toolkit/src/view/pipeline-builder/lib/templates.ts)

Please put the new template with its good friends. And add some categories to it.

Here are the categories we have

- AI-generated art
- Copywriting
- Extraction
- Summarization

## Test the template

Then you can test your pipeline buy doing these steps

- At the root of the repo, run `pnpm build`, and after the build is done,
- Go to /apps/console and run `pnpm dev`
