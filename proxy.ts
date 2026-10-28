import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleI18n = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const response = handleI18n(request);
  // /en/... always redirects to the unprefixed URL, so tell search engines it is permanent.
  // Other redirects (e.g. language detection on /) stay temporary.
  if (response.status === 307 && /^\/en(\/|$)/.test(request.nextUrl.pathname)) {
    return new NextResponse(null, { status: 308, headers: response.headers });
  }
  return response;
}

export const config = {
  // Everything except API routes, Next internals and files with an extension.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
