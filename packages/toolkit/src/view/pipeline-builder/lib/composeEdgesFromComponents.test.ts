import { test, expect } from "vitest";
import { PipelineComponent } from "../../../lib";
import { composeEdgesFromComponents } from "./composeEdgesFromComponents";

test("should get edges from basic components", () => {
  const components: PipelineComponent[] = [
    {
      id: "start",
      start_component: {
        fields: {
          texts: {
            instill_format: "array:string",
            title: "texts",
            description: "",
          },
        },
      },
    },
    {
      id: "end",
      end_component: {
        fields: {
          result: {
            title: "result",
            description: "",
            value: "${start.texts}",
          },
        },
      },
    },
  ];

  const edges = composeEdgesFromComponents(components);

  expect(edges[0].source).toBe("start");
  expect(edges[0].target).toBe("end");

  const wrongComponents: PipelineComponent[] = [
    {
      id: "start",
      start_component: {
        fields: {
          texts: {
            instill_format: "array:string",
            title: "texts",
            description: "",
          },
        },
      },
    },
    {
      id: "end",
      end_component: {
        fields: {
          result: {
            title: "result",
            description: "",
            value: "${foo.texts}",
          },
        },
      },
    },
  ];

  const wrongComponentsEdges = composeEdgesFromComponents(wrongComponents);

  expect(wrongComponentsEdges.length).toBe(0);
});

test("should strictly check the reference field exist", () => {
  const components: PipelineComponent[] = [
    {
      id: "start",
      start_component: {
        fields: {
          texts: {
            instill_format: "array:string",
            title: "texts",
            description: "",
          },
        },
      },
    },
    {
      id: "end",
      end_component: {
        fields: {
          result: {
            title: "result",
            description: "",
            value: "${start.foo}",
          },
        },
      },
    },
  ];

  const edges = composeEdgesFromComponents(components);

  expect(edges.length).toBe(0);
});

test("should loosely check the reference field exist when reference has square brace", () => {
  const components: PipelineComponent[] = [
    {
      id: "start",
      start_component: {
        fields: {
          texts: {
            instill_format: "array:string",
            title: "texts",
            description: "",
          },
        },
      },
    },
    {
      id: "end",
      end_component: {
        fields: {
          result: {
            title: "result",
            description: "",
            value: "${start['foo bar']['aaa']}",
          },
        },
      },
    },
  ];

  const edges = composeEdgesFromComponents(components);

  expect(edges[0].source).toBe("start");
  expect(edges[0].target).toBe("end");

  const wrongComponents: PipelineComponent[] = [
    {
      id: "start",
      start_component: {
        fields: {
          texts: {
            instill_format: "array:string",
            title: "texts",
            description: "",
          },
        },
      },
    },
    {
      id: "end",
      end_component: {
        fields: {
          result: {
            title: "result",
            description: "",
            value: "${foo['foo bar']['aaa']}",
          },
        },
      },
    },
  ];

  const wrongComponentsEdges = composeEdgesFromComponents(wrongComponents);

  expect(wrongComponentsEdges.length).toBe(0);
});
