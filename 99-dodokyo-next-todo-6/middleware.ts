import { NextRequest, NextResponse } from "next/server";

// https://www.inflearn.com/course/lecture?courseSlug=supabase-next-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0&unitId=222529&tab=curriculum
const COOKIE_COUNTER = "cookie-counter";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (request.cookies.get(COOKIE_COUNTER)?.value) {
    const prev = request.cookies.get(COOKIE_COUNTER)?.value;
    response.cookies.set(COOKIE_COUNTER, `${Number(prev) + 1}`);
  } else {
    response.cookies.set(COOKIE_COUNTER, "1");
  }

  return response;
}

export const config = {
  matcher: ["/", "/todo-no-rls", "/api/:path*"],
};
