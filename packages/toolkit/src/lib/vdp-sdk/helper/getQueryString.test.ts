import { test, expect } from "vitest";
import { getQueryString } from "./getQueryString";

test("baseURL contains no query string", () => {
  const baseURL = "https://www.google.com";
  const pageSize = 10;
  const nextPageToken = "nextPageToken";
  const filter = "filter=a";

  const queryString = getQueryString({
    baseURL,
    pageSize,
    nextPageToken,
    filter,
  });

  expect(queryString).toBe(
    "https://www.google.com?page_size=10&page_token=nextPageToken&filter=filter=a"
  );
});

test("baseURL contains a query string", () => {
  const baseURL = "https://www.google.com?q=hello";
  const pageSize = 10;
  const nextPageToken = "nextPageToken";
  const filter = "filter=a";

  const queryString = getQueryString({
    baseURL,
    pageSize,
    nextPageToken,
    filter,
  });

  expect(queryString).toBe(
    "https://www.google.com?q=hello&page_size=10&page_token=nextPageToken&filter=filter=a"
  );
});

test("pageSize is null", () => {
  const baseURL = "https://www.google.com";
  const pageSize = null;
  const nextPageToken = "nextPageToken";
  const filter = "filter=a";

  const queryString = getQueryString({
    baseURL,
    pageSize,
    nextPageToken,
    filter,
  });

  expect(queryString).toBe(
    "https://www.google.com?page_token=nextPageToken&filter=filter=a"
  );
});

test("nextPageToken is null", () => {
  const baseURL = "https://www.google.com";
  const pageSize = 10;
  const nextPageToken = null;
  const filter = "filter=a";

  const queryString = getQueryString({
    baseURL,
    pageSize,
    nextPageToken,
    filter,
  });

  expect(queryString).toBe(
    "https://www.google.com?page_size=10&filter=filter=a"
  );
});

test("filter is null", () => {
  const baseURL = "https://www.google.com";
  const pageSize = 10;
  const nextPageToken = "nextPageToken";
  const filter = null;

  const queryString = getQueryString({
    baseURL,
    pageSize,
    nextPageToken,
    filter,
  });

  expect(queryString).toBe(
    "https://www.google.com?page_size=10&page_token=nextPageToken"
  );
});

test("pageSize and nextPageToken are null", () => {
  const baseURL = "https://www.google.com";
  const pageSize = null;
  const nextPageToken = null;
  const filter = "filter=a";

  const queryString = getQueryString({
    baseURL,
    pageSize,
    nextPageToken,
    filter,
  });

  expect(queryString).toBe("https://www.google.com?filter=filter=a");
});

test("pageSize and filter are null", () => {
  const baseURL = "https://www.google.com";
  const pageSize = null;
  const nextPageToken = "nextPageToken";
  const filter = null;

  const queryString = getQueryString({
    baseURL,
    pageSize,
    nextPageToken,
    filter,
  });

  expect(queryString).toBe("https://www.google.com?page_token=nextPageToken");
});

test("nextPageToken and filter are null", () => {
  const baseURL = "https://www.google.com";
  const pageSize = 10;
  const nextPageToken = null;
  const filter = null;

  const queryString = getQueryString({
    baseURL,
    pageSize,
    nextPageToken,
    filter,
  });

  expect(queryString).toBe("https://www.google.com?page_size=10");
});

test("pageSize and nextPageToken and filter are null", () => {
  const baseURL = "https://www.google.com";
  const pageSize = null;
  const nextPageToken = null;
  const filter = null;

  const queryString = getQueryString({
    baseURL,
    pageSize,
    nextPageToken,
    filter,
  });

  expect(queryString).toBe("https://www.google.com");
});

test("baseURL contains a query string, pageSize and nextPageToken and filter are null", () => {
  const baseURL = "https://www.google.com?q=hello";
  const pageSize = null;
  const nextPageToken = null;
  const filter = null;

  const queryString = getQueryString({
    baseURL,
    pageSize,
    nextPageToken,
    filter,
  });

  expect(queryString).toBe("https://www.google.com?q=hello");
});

test("baseURL contains a query string, pageSize and filter are null", () => {
  const baseURL = "https://www.google.com?q=hello";
  const pageSize = null;
  const nextPageToken = "nextPageToken";
  const filter = null;

  const queryString = getQueryString({
    baseURL,
    pageSize,
    nextPageToken,
    filter,
  });

  expect(queryString).toBe(
    "https://www.google.com?q=hello&page_token=nextPageToken"
  );
});

test("baseURL contains a query string, nextPageToken and filter is null", () => {
  const baseURL = "https://www.google.com?q=hello";
  const pageSize = 10;
  const nextPageToken = null;
  const filter = null;

  const queryString = getQueryString({
    baseURL,
    pageSize,
    nextPageToken,
    filter,
  });

  expect(queryString).toBe("https://www.google.com?q=hello&page_size=10");
});

test("baseURL contains a query string, all other fields included", () => {
  const baseURL = "https://www.google.com?q=hello";
  const pageSize = 10;
  const nextPageToken = "nextPageToken";
  const filter = "filter=a";

  const queryString = getQueryString({
    baseURL,
    pageSize,
    nextPageToken,
    filter,
  });

  expect(queryString).toBe(
    "https://www.google.com?q=hello&page_size=10&page_token=nextPageToken&filter=filter=a"
  );
});
