import { NextResponse, NextRequest } from 'next/server'
 
export function hubRedirect(request: NextRequest) {
  const { origin } = request.nextUrl;
  const instillHubRoute = request.cookies.get('instill-hub-route');

  if (instillHubRoute?.value) {
    return NextResponse.redirect(new URL(`/hub/${instillHubRoute.value}`, origin));
  }

  return NextResponse.redirect(new URL("/hub/explore/pipelines", origin));
}