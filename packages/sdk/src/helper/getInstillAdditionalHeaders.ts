export function getInstillAdditionalHeaders({
  returnTraces,
  requesterUid,
  shareCode,
  streaming,
}: {
  returnTraces?: boolean;
  requesterUid?: string;
  shareCode?: string;
  streaming?: boolean;
}) {
  const headers: Record<string, string> = {};
  const corsHeaders: string[] = [];

  if (returnTraces) {
    headers["instill-return-traces"] = "true";
    corsHeaders.push("instill-return-traces");
  }

  if (requesterUid) {
    headers["Instill-Requester-Uid"] = requesterUid;
    corsHeaders.push("Instill-Requester-Uid");
  }

  if (shareCode) {
    headers["instill-share-code"] = shareCode;
    corsHeaders.push("instill-share-code");
  }

  if (streaming) {
    headers["Instill-Use-SSE"] = "true";
    corsHeaders.push("Instill-Use-SSE");
  }

  return corsHeaders.length > 0
    ? {
        ...headers,
        "Access-Control-Allow-Headers": corsHeaders.join(", "),
      }
    : {};
}
