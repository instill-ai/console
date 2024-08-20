import { withMiddlewareAuthRequired } from "./lib";

export default withMiddlewareAuthRequired();

export const config = {
  matcher: [
    "/(.*?)/connectors/:path*",
    "/(.*?)/dashboard/:path*",
    "/(.*?)/pipelines",

    // For pipeline editor
    "/(.*?)/pipelines/(.*?)/editor",
    "/(.*?)/models/:path*",
    "/settings",

    // For Catalog
    "/(.*?)/catalog/:path*",
  ],
};
