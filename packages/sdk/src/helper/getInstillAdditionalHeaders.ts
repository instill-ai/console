export function getInstillAdditionalHeaders({
  returnTraces,
  requesterId,
  shareCode,
  stream,
  isConsole,
  userUid,
}: {
  returnTraces?: boolean;
  requesterId?: string;
  shareCode?: string;
  stream?: boolean;
  isConsole?: boolean;
  userUid?: string;
}) {
  const headers: Record<string, string> = {};
  const corsHeaders: string[] = [];

  if (returnTraces) {
    headers["instill-return-traces"] = "true";
    corsHeaders.push("instill-return-traces");
  }

  if (userUid) {
    headers["instill-user-uid"] = userUid;
    corsHeaders.push("instill-user-uid");
  }

  if (requesterId) {
    headers["Instill-Requester-Uid"] = requesterId;
    corsHeaders.push("Instill-Requester-Uid");
  }

  if (shareCode) {
    headers["instill-share-code"] = shareCode;
    corsHeaders.push("instill-share-code");
  }

  if (stream) {
    headers["Accept"] = "text/event-stream";
    corsHeaders.push("Accept");
  }

  if (isConsole) {
    headers["Instill-User-Agent"] = "RUN_SOURCE_CONSOLE";
    corsHeaders.push("Instill-User-Agent");
  }

  return corsHeaders.length > 0
    ? {
        ...headers,
        "Access-Control-Allow-Headers": corsHeaders.join(", "),
      }
    : {};
}
