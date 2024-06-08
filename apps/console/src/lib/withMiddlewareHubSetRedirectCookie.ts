import { NextResponse, NextRequest } from "next/server";

export function hubRedirectSetCookie(request: NextRequest) {
  const response = NextResponse.next();
  const path = request.nextUrl.pathname.substring(
    request.nextUrl.pathname.indexOf("hub/") + 4,
  );

  response.cookies.set("instill-hub-route", path);

  return response;
}
