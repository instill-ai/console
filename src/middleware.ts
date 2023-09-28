import { withMiddlewareAuthRequired } from "./lib";

export default withMiddlewareAuthRequired();

export const config = {
  matcher: [
    "/(.*?)/resources/:path*",
    "/(.*?)/dashboard/:path*",
    "/(.*?)/pipelines/:path*",
    "/(.*?)/model-hub/:path*",
    "/settings",
  ],
};
