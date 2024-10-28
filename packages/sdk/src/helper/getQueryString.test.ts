import { expect, test } from "vitest";

import { getQueryString } from "./getQueryString";

test("baseURL contains no query string", () => {
  const baseURL = "https://www.google.com";
  const pageSize = 10;
  const pageToken = "pageToken";
  const filter = "filter=a";

  const queryString = getQueryString({
    baseURL,
    pageSize,
    pageToken,
    filter,
  });

  expect(queryString).toBe(
    "https://www.google.com?pageSize=10&pageToken=pageToken&filter=filter=a",
  );
});

test("baseURL contains a query string", () => {
  const baseURL = "https://www.google.com?q=hello";
  const pageSize = 10;
  const pageToken = "pageToken";
  const filter = "filter=a";

  const queryString = getQueryString({
    baseURL,
    pageSize,
    pageToken,
    filter,
  });

  expect(queryString).toBe(
    "https://www.google.com?q=hello&pageSize=10&pageToken=pageToken&filter=filter=a",
  );
});

test("pageSize is null", () => {
  const baseURL = "https://www.google.com";
  const pageSize = undefined;
  const pageToken = "pageToken";
  const filter = "filter=a";

  const queryString = getQueryString({
    baseURL,
    pageSize,
    pageToken,
    filter,
  });

  expect(queryString).toBe(
    "https://www.google.com?pageToken=pageToken&filter=filter=a",
  );
});

test("pageToken is null", () => {
  const baseURL = "https://www.google.com";
  const pageSize = 10;
  const pageToken = undefined;
  const filter = "filter=a";

  const queryString = getQueryString({
    baseURL,
    pageSize,
    pageToken,
    filter,
  });

  expect(queryString).toBe(
    "https://www.google.com?pageSize=10&filter=filter=a",
  );
});

test("filter is null", () => {
  const baseURL = "https://www.google.com";
  const pageSize = 10;
  const pageToken = "pageToken";
  const filter = null;

  const queryString = getQueryString({
    baseURL,
    pageSize,
    pageToken,
    filter,
  });

  expect(queryString).toBe(
    "https://www.google.com?pageSize=10&pageToken=pageToken",
  );
});

test("pageSize and pageToken are null", () => {
  const baseURL = "https://www.google.com";
  const pageSize = undefined;
  const pageToken = undefined;
  const filter = "filter=a";

  const queryString = getQueryString({
    baseURL,
    pageSize,
    pageToken,
    filter,
  });

  expect(queryString).toBe("https://www.google.com?filter=filter=a");
});

test("pageSize and filter are null", () => {
  const baseURL = "https://www.google.com";
  const pageSize = undefined;
  const pageToken = "pageToken";
  const filter = null;

  const queryString = getQueryString({
    baseURL,
    pageSize,
    pageToken,
    filter,
  });

  expect(queryString).toBe("https://www.google.com?pageToken=pageToken");
});

test("pageToken and filter are null", () => {
  const baseURL = "https://www.google.com";
  const pageSize = 10;
  const pageToken = undefined;
  const filter = null;

  const queryString = getQueryString({
    baseURL,
    pageSize,
    pageToken,
    filter,
  });

  expect(queryString).toBe("https://www.google.com?pageSize=10");
});

test("pageSize and pageToken and filter are null", () => {
  const baseURL = "https://www.google.com";
  const pageSize = undefined;
  const pageToken = undefined;
  const filter = null;

  const queryString = getQueryString({
    baseURL,
    pageSize,
    pageToken,
    filter,
  });

  expect(queryString).toBe("https://www.google.com");
});

test("baseURL contains a query string, pageSize and pageToken and filter are null", () => {
  const baseURL = "https://www.google.com?q=hello";
  const pageSize = undefined;
  const pageToken = undefined;
  const filter = null;

  const queryString = getQueryString({
    baseURL,
    pageSize,
    pageToken,
    filter,
  });

  expect(queryString).toBe("https://www.google.com?q=hello");
});

test("baseURL contains a query string, pageSize and filter are null", () => {
  const baseURL = "https://www.google.com?q=hello";
  const pageSize = undefined;
  const pageToken = "pageToken";
  const filter = null;

  const queryString = getQueryString({
    baseURL,
    pageSize,
    pageToken,
    filter,
  });

  expect(queryString).toBe(
    "https://www.google.com?q=hello&pageToken=pageToken",
  );
});

test("baseURL contains a query string, pageToken and filter is null", () => {
  const baseURL = "https://www.google.com?q=hello";
  const pageSize = 10;
  const pageToken = undefined;
  const filter = null;

  const queryString = getQueryString({
    baseURL,
    pageSize,
    pageToken,
    filter,
  });

  expect(queryString).toBe("https://www.google.com?q=hello&pageSize=10");
});

test("baseURL contains a query string, all other fields included", () => {
  const baseURL = "https://www.google.com?q=hello";
  const pageSize = 10;
  const pageToken = "pageToken";
  const filter = "filter=a";

  const queryString = getQueryString({
    baseURL,
    pageSize,
    pageToken,
    filter,
  });

  expect(queryString).toBe(
    "https://www.google.com?q=hello&pageSize=10&pageToken=pageToken&filter=filter=a",
  );
});
