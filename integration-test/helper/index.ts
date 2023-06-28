/* eslint-disable @typescript-eslint/no-explicit-any */

import { BrowserContext, expect, Locator } from "@playwright/test";
import axios from "axios";

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const addUserCookie = async (context: BrowserContext) => {
  await context.addCookies([
    {
      name: "instill-ai-user",
      domain: env("NEXT_PUBLIC_CONSOLE_BASE_URL")?.split(":")[0],
      path: "/",
      value: JSON.stringify({ cookie_token: "instill-token" }),
      httpOnly: true,
    },
  ]);

  const newCookies = await context.cookies();
  const instillAiUser = newCookies.find((e) => e.name === "instill-ai-user");
  expect(instillAiUser).toBeDefined();
};

export const expectToSelectOption = async (
  clickElement: Locator,
  selectElement: Locator,
  waitForElement?: Locator
) => {
  await clickElement.click({ force: true });

  if (waitForElement) {
    await Promise.all([waitForElement.waitFor(), selectElement.click()]);
  } else {
    await selectElement.click();
  }
};

export const deleteDestination = async (
  destinationId: string
): Promise<void> => {
  try {
    const client = createInstillAxiosTestClient("vdp");

    const { data } = await client.get(`/destination-connectors?view=VIEW_FULL`);

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const targetDestination = (data.destination_connectors as any[]).find(
      (e) => e.id === destinationId
    );

    if (targetDestination) {
      await client.delete(`/destination-connectors/${destinationId}`);
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteAllDestinations = async () => {
  try {
    const client = createInstillAxiosTestClient("vdp");

    const { data } = await client.get(`/destination-connectors?view=VIEW_FULL`);

    for (const destination of data.destination_connectors) {
      await client.delete(`/destination-connectors/${destination.id}`);
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteSource = async (sourceId: string): Promise<void> => {
  try {
    const client = createInstillAxiosTestClient("vdp");

    const { data } = await client.get(`/source-connectors?view=VIEW_FULL`);

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const targetSource = (data.source_connectors as any[]).find(
      (e) => e.id === sourceId
    );

    if (targetSource) {
      await client.delete(`/source-connectors/${sourceId}`);
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteAllSources = async () => {
  try {
    const client = createInstillAxiosTestClient("vdp");

    const { data } = await client.get(`/source-connectors?view=VIEW_FULL`);

    for (const source of data.source_connectors) {
      await client.delete(`/source-connectors/${source.id}`);
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteModel = async (modelId: string) => {
  try {
    const client = createInstillAxiosTestClient("model");

    const { data } = await client.get(`/models?view=VIEW_FULL`);

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const targetModel = (data.models as any[]).find((e) => e.id === modelId);

    if (targetModel) {
      await client.delete(`/models/${modelId}`);
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteAllModels = async () => {
  try {
    const client = createInstillAxiosTestClient("model");

    const { data } = await client.get(`/models?view=VIEW_FULL`);

    for (const model of data.models) {
      await client.delete(`/models/${model.id}`);
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteAllPipelines = async () => {
  try {
    const client = createInstillAxiosTestClient("vdp");

    const { data } = await client.get(`/pipelines?view=VIEW_FULL`);

    for (const pipeline of data.pipelines) {
      await client.delete(`/pipelines/${pipeline.id}`);
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const createInstillAxiosTestClient = (
  apiGatewayType: "base" | "model" | "vdp"
) => {
  let baseURL: string | null = null;

  if (apiGatewayType === "base") {
    baseURL = `${env("NEXT_PUBLIC_BASE_API_GATEWAY_BASE_URL")}/${env(
      "NEXT_PUBLIC_API_VERSION"
    )}`;
  } else if (apiGatewayType === "model") {
    baseURL = `${env("NEXT_PUBLIC_MODEL_API_GATEWAY_BASE_URL")}/${env(
      "NEXT_PUBLIC_API_VERSION"
    )}`;
  } else if (apiGatewayType === "vdp") {
    baseURL = `${env("NEXT_PUBLIC_VDP_API_GATEWAY_BASE_URL")}/${env(
      "NEXT_PUBLIC_API_VERSION"
    )}`;
  }

  if (!baseURL) {
    throw new Error("Base URL is not defined");
  }

  return axios.create({
    baseURL,
  });
};

// Simplified from:
// https://github.com/andrewmclagan/react-env/blob/master/packages/node/src/index.js

function isBrowser() {
  return Boolean(typeof window !== "undefined");
}

export const env = (key = "") => {
  if (!key.length) {
    throw new Error("No env key provided");
  }

  if (isBrowser() && (window as any).__env) {
    return (window as any).__env[key] === "''"
      ? ""
      : (window as any).__env[key];
  }

  return process.env[key] === "''" ? "" : process.env[key];
};
