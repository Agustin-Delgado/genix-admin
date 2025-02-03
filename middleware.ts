import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/users(.*)"];
const authRoutes = ["/sign-in"];
const defaultRoute = "/users";

export default async function authMiddleware(request: NextRequest) {
  const sessionToken = request.cookies.get("sessionToken")?.value;
  const pathname = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) => pathname.match(route));
  const isAuthRoute = authRoutes.includes(pathname);

  if (pathname === "/") {
    return NextResponse.redirect(new URL(defaultRoute, request.url));
  }

  if (!sessionToken && isProtectedRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (sessionToken && isAuthRoute) {
    return NextResponse.redirect(new URL("/users", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
