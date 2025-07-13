import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
export async function middleware(request: NextRequest) {

  const path = request.nextUrl.pathname;
  const isPublicPath =
    path === "/signin" || path === "/signup" || path == "/";

 const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/", "/signin", "/signup", "/profile"],
};