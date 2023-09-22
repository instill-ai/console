import { NextMiddleware, NextResponse } from "next/server";

export type WithMiddlewareAuthRequiredOptions = {
  middleware?: NextMiddleware;
};

export function withMiddlewareAuthRequired(
  props?: NextMiddleware | WithMiddlewareAuthRequiredOptions
): NextMiddleware {
  return async function wrappedMiddleware(...args) {
    const [req] = args;
    let middleware: NextMiddleware | undefined;
    const { pathname, origin } = req.nextUrl;

    if (typeof props === "function") {
      middleware = props;
    } else if (props?.middleware) {
      middleware = props.middleware;
    }

    const ignorePaths = ["/_next", "/favicon.ico"];
    if (ignorePaths.some((p) => pathname.startsWith(p))) {
      return;
    }

    const authRes = NextResponse.next();
    const sessionCookie = req.cookies.get("instill-ai-session");
    const session = JSON.parse(sessionCookie?.value || "{}");

    if (!session.access_token) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json(
          {
            error: "not_authenticated",
            description:
              "The user does not have an active session or is not authenticated",
          },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL("/login", origin));
    }

    const providedMiddlewareRes = await (middleware && middleware(...args));

    if (providedMiddlewareRes) {
      const nextRes = new NextResponse(
        providedMiddlewareRes.body,
        providedMiddlewareRes
      );
      const cookies = authRes.cookies.getAll();
      if ("cookies" in providedMiddlewareRes) {
        for (const cookie of providedMiddlewareRes.cookies.getAll()) {
          nextRes.cookies.set(cookie);
        }
      }
      for (const cookie of cookies) {
        if (!nextRes.cookies.get(cookie.name)) {
          nextRes.cookies.set(cookie);
        }
      }
      return nextRes;
    } else {
      return authRes;
    }
  };
}
