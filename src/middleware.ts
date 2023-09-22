import { withMiddlewareAuthRequired } from "./lib";

export default withMiddlewareAuthRequired();

export const config = {
  matcher: [
    "/resources/:path*",
    "/dashboard/:path*",
    "/model-hub/:path*",
    "/pipelines/:path*",
    "/settings/:path*",
  ],
};
