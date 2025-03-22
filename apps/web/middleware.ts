import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { isHiddenAuthenticatedPath, isUnprotectedPath } from "./lib/paths";
import { env } from "@/lib/env";

export default withAuth({
  pages: {
    signIn: "/sign-in",
  },
});

export const config = {
  matcher: ["/((?!api/cron|api/auth|api/key|api/users/email|_next/static|_next/image|.*\\.png$).*)"],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: env.AUTH_SECRET,
  });

  if (request.nextUrl.pathname === "/") return NextResponse.next();

  if (!token && request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (!!token && isHiddenAuthenticatedPath(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  if (!token && !isUnprotectedPath(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/sign-in", request.nextUrl));
  }

  return NextResponse.next();
}