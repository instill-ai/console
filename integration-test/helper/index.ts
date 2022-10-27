import { BrowserContext, expect, Locator } from "@playwright/test";
import axios from "axios";

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const addUserCookie = async (context: BrowserContext) => {
  await context.addCookies([
    {
      name: "instill-ai-user",
      domain: process.env.NEXT_PUBLIC_MAIN_URL?.split(":")[0],
      path: "/",
      value: JSON.stringify({ cookie_token: "instill-token" }),
      httpOnly: process.env.NODE_ENV === "production" ? true : false,
    },
  ]);

  const newCookies = await context.cookies();
  const instillAiUser = newCookies.find((e) => e.name === "instill-ai-user");
  expect(instillAiUser).toBeDefined();
};

export const expectToSelectReactSelectOption = async (
  clickElement: Locator,
  selectElement: Locator,
  waitForElement?: Locator
) => {
  await clickElement.click({ force: true });

  if (waitForElement) {
    await Promise.all([
      waitForElement.waitFor({ state: "visible" }),
      selectElement.click(),
    ]);
  } else {
    await selectElement.click();
  }
};

export const deleteDestination = async (
  destinationId: string
): Promise<void> => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_CONNECTOR_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/destination-connectors?view=VIEW_FULL`
    );

    const targetDestination = (data.destination_connectors as any[]).find(
      (e) => e.id === destinationId
    );

    if (targetDestination) {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_CONNECTOR_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/destination-connectors/${destinationId}`
      );
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteAllDestinations = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_CONNECTOR_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/destination-connectors?view=VIEW_FULL`
    );

    for (const destination of data.destination_connectors) {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_CONNECTOR_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/destination-connectors/${destination.id}`
      );
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteSource = async (sourceId: string): Promise<void> => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_CONNECTOR_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/source-connectors?view=VIEW_FULL`
    );

    const targetSource = (data.source_connectors as any[]).find(
      (e) => e.id === sourceId
    );

    if (targetSource) {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_CONNECTOR_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/source-connectors/${sourceId}`
      );
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteAllSources = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_CONNECTOR_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/source-connectors?view=VIEW_FULL`
    );

    for (const source of data.source_connectors) {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_CONNECTOR_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/source-connectors/${source.id}`
      );
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteModel = async (modelId: string) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_MODEL_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/models?view=VIEW_FULL`
    );

    const targetModel = (data.models as any[]).find((e) => e.id === modelId);

    if (targetModel) {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_MODEL_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/models/${modelId}`
      );
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteAllModels = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_MODEL_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/models?view=VIEW_FULL`
    );

    for (const model of data.models) {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_MODEL_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/models/${model.id}`
      );
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteAllPipelines = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_PIPELINE_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/pipelines?view=VIEW_FULL`
    );

    for (const pipeline of data.pipelines) {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_PIPELINE_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/pipelines/${pipeline.id}`
      );
    }
  } catch (err) {
    return Promise.reject(err);
  }
};
