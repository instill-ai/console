import { BrowserContext, expect, Locator, Page } from "@playwright/test";
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

export const cleanUpDestination = async (id: string): Promise<void> => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_CONNECTOR_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/destination-connectors?view=VIEW_FULL`
    );

    const targetDestination = (data.destination_connectors as any[]).find(
      (e) => e.id === id
    );

    if (targetDestination) {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_CONNECTOR_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/destination-connectors/${id}`
      );
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const cleanUpSource = async (id: string): Promise<void> => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_CONNECTOR_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/source-connectors?view=VIEW_FULL`
    );

    const targetSource = (data.destination_connectors as any[]).find(
      (e) => e.id === id
    );

    if (targetSource) {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_CONNECTOR_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/source-connectors/${id}`
      );
    }
  } catch (err) {
    return Promise.reject(err);
  }
};
