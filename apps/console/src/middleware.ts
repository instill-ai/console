import createMiddleware from 'next-easy-middlewares';
import { withMiddlewareAuthRequired } from "./lib";
import { hubRedirect } from 'lib/withMiddlewareHubRedirect';

const middlewares = {
  // Authentication guard
  "/(.*?)/connectors/:path*": withMiddlewareAuthRequired(),
  "/(.*?)/dashboard/:path*": withMiddlewareAuthRequired(),
  "/(.*?)/pipelines": withMiddlewareAuthRequired(),
  // For pipeline builder
  "/(.*?)/pipelines/(.*?)/builder": withMiddlewareAuthRequired(),
  "/(.*?)/models/:path*": withMiddlewareAuthRequired(),
  "/settings": withMiddlewareAuthRequired(),

  // Hub redirect
  "/hub": hubRedirect,  
};

export const middleware = createMiddleware(middlewares);

export const config = {
  /*
  * Match all paths except for:
  * 1. /api/ routes
  * 2. /_next/ (Next.js internals)
  * 3. /_static (inside /public)
  * 4. /_vercel (Vercel internals)
  * 5. Static files (e.g. /favicon.ico, /sitemap.xml, /robots.txt, etc.)
  */
  matcher: ['/((?!api/|_next/|_static|_vercel|[\\w-]+\\.\\w+).*)'],
};