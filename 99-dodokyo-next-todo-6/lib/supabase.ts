import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getCookie, setCookie } from "cookies-next";
import { Database } from "@/types/supabase";

/**
 * @reference https://www.inflearn.com/course/lecture?courseSlug=supabase-next-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0&unitId=221360&tab=script
 */

/**
 * @description
 * 서버 사이드에서 사용하는 수파베이스 클라이언트
 * 브라우저 사이드 수파베이스 클라이언트랑은 다르게 nextjs에서 쿠키 설정 같은 작업이 있음
 * 
 * nextjs 서버 측 로직은 크게 4가지 구성이 있ㅇㅁ
 * 1. RouterHandler
 * 2. RSC
 * 3. Middleware
 * 4. ServerActions
 * 
 * - RSC에서는 쿠키를 조작할 수 없음
 * - RouterHandler, Middleware, ServerActions에서는 쿠키 조작 가능
 *   - 그러나 조작 방법이 다 다르다
 *   - 그래서 수파베이스 서버 클라이언트는 총 3개를 만들어야 함
 *     - RouterHandler
 *     - Middleware
 *     - ServerActions
 */

// - ServerActions, RouterHandler
export const createServerSideClient = async (serverComponent = false) => {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      /**
       * 쿠키 관련 옵션
       */
      cookies: {
        get: (key) => cookieStore.get(key)?.value,
        set: (key, value, options) => {
          /**
           * 서버 컴포넌트인 경우 쿠키 세팅 못하도록
           */
          if (serverComponent) return;
          cookieStore.set(key, value, options);
        },
        remove: (key, options) => {
          /**
           * 서버 컴포넌트인 경우 쿠키 제거 못하도록
           */
          if (serverComponent) return;
          cookieStore.set(key, "", options);
        },
      },
    }
  );
};

// - RSC
export const createServerSideClientRSC = async () => {
  return createServerSideClient(true);
};

// - Middleware
export const createServerSideMiddleware = async (
  req: NextRequest,
  res: NextResponse
) => {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      /**
       * 쿠키 관련 옵션
       */
      cookies: {
        get: (key) => getCookie(key, { req, res }),
        set: (key, value, options) => {
          setCookie(key, value, { req, res, ...options });
        },
        remove: (key, options) => {
          setCookie(key, "", { req, res, ...options });
        },
      },
    }
  );
};
