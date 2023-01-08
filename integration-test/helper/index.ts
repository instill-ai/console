import { env } from "@/utils/config";
import { BrowserContext, expect, Locator } from "@playwright/test";
import axios from "axios";
import * as https from "https";

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const addUserCookie = async (context: BrowserContext) => {
  await context.addCookies([
    {
      name: "instill-ai-user",
      domain: env("NEXT_PUBLIC_CONSOLE_BASE_URL")?.split(":")[0],
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
    const client = createInstillAxiosTestClient();

    const { data } = await client.get(
      `${env("NEXT_PUBLIC_API_VERSION")}/destination-connectors?view=VIEW_FULL`
    );

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const targetDestination = (data.destination_connectors as any[]).find(
      (e) => e.id === destinationId
    );

    if (targetDestination) {
      await client.delete(
        `${env(
          "NEXT_PUBLIC_API_VERSION"
        )}/destination-connectors/${destinationId}`
      );
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteAllDestinations = async () => {
  try {
    const client = createInstillAxiosTestClient();

    const { data } = await client.get(
      `${env("NEXT_PUBLIC_API_VERSION")}/destination-connectors?view=VIEW_FULL`
    );

    for (const destination of data.destination_connectors) {
      await client.delete(
        `${env("NEXT_PUBLIC_API_VERSION")}/destination-connectors/${
          destination.id
        }`
      );
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteSource = async (sourceId: string): Promise<void> => {
  try {
    const client = createInstillAxiosTestClient();

    const { data } = await client.get(
      `${env("NEXT_PUBLIC_API_VERSION")}/source-connectors?view=VIEW_FULL`
    );

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const targetSource = (data.source_connectors as any[]).find(
      (e) => e.id === sourceId
    );

    if (targetSource) {
      await client.delete(
        `${env("NEXT_PUBLIC_API_VERSION")}/source-connectors/${sourceId}`
      );
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteAllSources = async () => {
  try {
    const client = createInstillAxiosTestClient();

    const { data } = await client.get(
      `${env("NEXT_PUBLIC_API_VERSION")}/source-connectors?view=VIEW_FULL`
    );

    for (const source of data.source_connectors) {
      await client.delete(
        `${env("NEXT_PUBLIC_API_VERSION")}/source-connectors/${source.id}`
      );
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteModel = async (modelId: string) => {
  try {
    const client = createInstillAxiosTestClient();

    const { data } = await client.get(
      `${env("NEXT_PUBLIC_API_VERSION")}/models?view=VIEW_FULL`
    );

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const targetModel = (data.models as any[]).find((e) => e.id === modelId);

    if (targetModel) {
      await client.delete(
        `${env("NEXT_PUBLIC_API_VERSION")}/models/${modelId}`
      );
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteAllModels = async () => {
  try {
    const client = createInstillAxiosTestClient();

    const { data } = await client.get(
      `${env("NEXT_PUBLIC_API_VERSION")}/models?view=VIEW_FULL`
    );

    for (const model of data.models) {
      await client.delete(
        `${env("NEXT_PUBLIC_API_VERSION")}/models/${model.id}`
      );
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteAllPipelines = async () => {
  try {
    const client = createInstillAxiosTestClient();

    const { data } = await client.get(
      `${env("NEXT_PUBLIC_API_VERSION")}/pipelines?view=VIEW_FULL`
    );

    for (const pipeline of data.pipelines) {
      await client.delete(
        `${env("NEXT_PUBLIC_API_VERSION")}/pipelines/${pipeline.id}`
      );
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const createInstillAxiosTestClient = () => {
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  return axios.create({
    baseURL: env("NEXT_PUBLIC_API_GATEWAY_BASE_URL"),
    httpsAgent,
  });
};
