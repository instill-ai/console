import { expect, test } from "vitest";

import { getInstillAdditionalHeaders } from "./getInstillAdditionalHeaders";

test("get basic instill headers", () => {
  const headers = getInstillAdditionalHeaders({});
  expect(headers).toEqual({});

  const returnTraceHeaders = getInstillAdditionalHeaders({
    returnTraces: true,
  });
  expect(returnTraceHeaders).toEqual({
    "instill-return-traces": "true",
    "Access-Control-Allow-Headers": "instill-return-traces",
  });

  const requesterUidHeaders = getInstillAdditionalHeaders({
    requesterUid: "requesterUid",
  });
  expect(requesterUidHeaders).toEqual({
    "Instill-Requester-Uid": "requesterUid",
    "Access-Control-Allow-Headers": "Instill-Requester-Uid",
  });

  const shareCodeHeaders = getInstillAdditionalHeaders({
    shareCode: "shareCode",
  });
  expect(shareCodeHeaders).toEqual({
    "instill-share-code": "shareCode",
    "Access-Control-Allow-Headers": "instill-share-code",
  });

  const allHeaders = getInstillAdditionalHeaders({
    returnTraces: true,
    requesterUid: "requesterUid",
    shareCode: "shareCode",
  });

  expect(allHeaders).toEqual({
    "instill-return-traces": "true",
    "Instill-Requester-Uid": "requesterUid",
    "instill-share-code": "shareCode",
    "Access-Control-Allow-Headers":
      "instill-return-traces, Instill-Requester-Uid, instill-share-code",
  });
});
